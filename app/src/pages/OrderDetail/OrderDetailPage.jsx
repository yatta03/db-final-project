import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseProvider";

import OrderDetail from "../../components/OrderDetail/OrderDetail";
import OrderStatus from "../../components/OrderDetail/OrderStatus";
import Quotes from "../../components/OrderDetail/Quotes";
import QuotePost from "../../components/OrderDetail/QuotePost";
import "./OrderDetail.css";

export default function OrderDetailPage({ role }) {
  const { orderId } = useParams();
  const { supabase, session, userProfile } = useSupabase();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrderData = async (orderId) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from("order_detail_view").select("*").eq("order_id", orderId).single();
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    console.log(data);
    setOrderData(data);
    setLoading(false);
  };

  const cancelOrder = async () => {
    const confirmed = window.confirm("確定要取消這筆訂單嗎？此操作無法復原。");
    if (!confirmed) return;

    const { error } = await supabase.from("orders").delete().eq("order_id", orderId).select();
    if (error) {
      console.error("cancel order fail", error);
      return;
    }

    alert("訂單已成功取消");
    setOrderData(null);
  };

  const postQuote = async (price) => {
    const { data, error } = await supabase
      .from("quotes")
      .insert([{ order_id: orderData.order_id, user_id: session.user.id, price: price }])
      .select()
      .single();

    if (error) {
      console.log(error);
      return false;
    }
    setOrderData((prev) => ({
      ...prev,
      quotes: prev.quotes?.length > 0 ? [...prev.quotes, { ...data, bidder_name: userProfile.name }] : [{ ...data, bidder_name: userProfile.name }],
    }));
    return true;
  };

  const removeQuote = async (quote) => {
    const { user_id, quotation_date_time } = quote;

    const { error } = await supabase.from("quotes").delete().match({
      user_id: user_id,
      order_id: orderData.order_id,
      quotation_date_time: quotation_date_time,
    });

    if (error) {
      console.error("刪除失敗：", error);
      return;
    }

    // Update local state
    setOrderData((prev) => ({
      ...prev,
      quotes: prev.quotes.filter((q) => !(q.user_id === user_id && q.quotation_date_time === quotation_date_time)),
    }));
  };

  const rejectQuote = async (quote) => {
    const { user_id, quotation_date_time } = quote;
    const { error } = await supabase
      .from("quotes")
      .update({ acceptance_status: "rejected" })
      .eq("user_id", user_id)
      .eq("order_id", orderData.order_id)
      .eq("quotation_date_time", quotation_date_time);
    if (error) console.error("Reject failed:", error);
    else {
      // update quote status
      setOrderData((prev) => ({
        ...prev,
        quotes: prev.quotes.map((q) => (Object.is(q.user_id, user_id) && q.quotation_date_time === quotation_date_time ? { ...q, acceptance_status: "rejected" } : q)),
      }));
    }
  };

  const acceptQuote = async (quote) => {
    const { user_id, quotation_date_time, price } = quote;
    const { error } = await supabase.rpc("accept_quote", {
      p_order_id: orderData.order_id,
      p_user_id: user_id,
      p_quotation_date_time: quotation_date_time,
      p_amount: price,
    });
    if (error) {
      console.error("Accept failed:", error);
      return;
    }

    await getOrderData(orderId);
  };

  useEffect(() => {
    if (orderId) {
      getOrderData(orderId);
    }
  }, [orderId]);

  if (!session)
    return (
      <div className="auth-already-logged">
        <p>未登入！</p>
        <Link to={"/user/signIn"}>登入</Link>
      </div>
    );
  if (loading) return <p>loading...</p>;
  if (!orderData) return <p>no data</p>;
  if (error) return <p>{JSON.stringify(error)}</p>;

  return (
    <div className="order-detail-page">
      {role === 'buyer' ? (
        <Link to={`/${role}/posted-orders`} className="back-to-list-btn">返回訂單列表</Link>
      ) : (
        <Link to={`/${role}/browse-orders`} className="back-to-list-btn">返回訂單列表</Link>
      )}

      <div className="top-section">
        <OrderDetail orderData={orderData} />
      </div>

      <div className="bottom-section">
        <div className="left-column">
          <OrderStatus orderData={orderData} curUserId={session?.user.id} role={role} cancelOrder={cancelOrder} />
        </div>

        <div className="right-column">
          <div className="status-item">
            <h3>{orderData?.is_order_accepted ? "報價歷史" : "報價"}</h3>
            <div className="quote-form">
              {role == "agent" && orderData.is_order_accepted == false && orderData.customer_userid != session?.user.id && (
                <>
                  <QuotePost postQuote={postQuote} />
                </>
              )}
            </div>

            <div className="quote-list">
              <Quotes
                quotes={orderData.quotes}
                curUserId={session?.user.id}
                orderOwnerId={orderData.customer_userid}
                onRemove={removeQuote}
                onReject={rejectQuote}
                onAccept={acceptQuote}
                role={role}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
