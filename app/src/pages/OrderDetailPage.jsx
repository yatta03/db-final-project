import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSupabase } from "../context/SupabaseProvider";

import OrderDetail from "../components/OrderDetail/OrderDetail";
import Quotes from "../components/OrderDetail/Quotes";

export default function OrderDetailPage({ role }) {
  const { orderId } = useParams();
  const { supabase, session } = useSupabase();

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

  useEffect(() => {
    if (orderId) {
      getOrderData(orderId);
    }
  }, [orderId]);

  if (loading) return <p>loading...</p>;
  if (error) return <p>{JSON.stringify(error)}</p>;

  return (
    <>
      <OrderDetail orderData={orderData} curUserId={session.user.id} role={role} />
      <h2>報價</h2>
      <Quotes quotes={orderData.quotes} />
    </>
  );
}
