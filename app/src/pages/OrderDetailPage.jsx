import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSupabase } from "../context/SupabaseProvider";

import OrderDetail from "../components/OrderDetail/OrderDetail";
import Quotes from "../components/OrderDetail/Quotes";
import QuotePost from "../components/OrderDetail/QuotePost";

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
    setOrderData((prev) => ({ ...prev, quotes: [...prev.quotes, { ...data, bidder_name: userProfile.name }] }));
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

  useEffect(() => {
    if (orderId) {
      getOrderData(orderId);
    }
  }, [orderId]);

  if (loading) return <p>loading...</p>;
  if (error) return <p>{JSON.stringify(error)}</p>;

  return (
    <>
      <OrderDetail orderData={orderData} curUserId={session?.user.id} role={role} />
      <h2>報價</h2>
      <Quotes quotes={orderData.quotes} curUserId={session?.user.id} onRemove={removeQuote} />

      {role == "agent" && orderData.is_order_accepted == false && orderData.customer_userid != session?.user.id && (
        <>
          <QuotePost postQuote={postQuote} />
        </>
      )}
    </>
  );
}
