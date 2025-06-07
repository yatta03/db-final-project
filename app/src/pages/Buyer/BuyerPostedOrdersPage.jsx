import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseProvider";
import styles from "./BuyerPostedOrdersPage.module.css"; // We will create this CSS module file

const BuyerPostedOrdersPage = () => {
  const { supabase, session } = useSupabase();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) {
        setLoading(false);
        setError("You must be logged in to see your orders.");
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_userid", session.user.id)
          .is("purchaser_userid", null)
          .eq("is_order_accepted", false)

        if (error) {
          throw error;
        }

        setOrders(data || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching posted orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [supabase, session]);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>我發佈的訂單</h1>
        <Link to="/buyer/create-order" className={styles.postButton}>
          發佈需求
        </Link>
      </header>
      <main className={styles.mainContent}>
        {loading && <p>Loading orders...</p>}
        {error && <p className={styles.errorText}>Error: {error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className={styles.noOrdersText}>當前暫無未被承接的訂單</p>
        )}
        {!loading && !error && orders.length > 0 && (
          <div className={styles.ordersGrid}>
            {orders.map((order) => (
              <div key={order.order_id} className={styles.orderCard}>
                <h2>訂單編號: {order.order_id}</h2>
                <p>金額: ${order.amount}</p>
                <p>建立時間: {new Date(order.created_at).toLocaleDateString()}</p>
                <Link to={`/buyer/order/${order.order_id}`} className={styles.detailsButton}>
                  查看詳情
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerPostedOrdersPage; 