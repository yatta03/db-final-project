import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabase } from '../../context/SupabaseProvider';
import styles from './AgentBrowseOrdersPage.module.css';

export default function AgentBrowseOrdersPage() {
  const { supabase } = useSupabase();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('您必須登入才能查看待接訂單。');
        setLoading(false);
        setOrders([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          order_id,
          created_at,
          users:customer_userid ( name ),
          products ( product_name, quantity, country )
        `)
        .is('purchaser_userid', null)
        .neq('customer_userid', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching orders:', fetchError);
        setError('無法讀取訂單列表：' + fetchError.message);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [supabase]);

  if (loading) {
    return <div className={styles.pageContainer}><p>正在載入待接訂單...</p></div>;
  }

  if (error) {
    return <div className={styles.pageContainer}><p className={styles.errorText}>{error}</p></div>;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>待接訂單瀏覽</h1>
      </header>

      <main>
        {orders.length === 0 ? (
          <p className={styles.noOrdersText}>目前沒有待處理的訂單。</p>
        ) : (
          <div className={styles.ordersGrid}>
            {orders.map((order) => (
              <Link to={`/agent/browse/order/${order.order_id}`} key={order.order_id} className={styles.orderCard}>
                <h2>訂單編號 #{order.order_id}</h2>
                <p><strong>客戶名稱：</strong> {order.users?.name || 'N/A'}</p>
                {order.products && order.products.length > 0 ? order.products.map((product, index) => (
                    <div key={index}>
                        <p><strong>商品名稱：</strong> {product.product_name}</p>
                        <p><strong>數量：</strong> {product.quantity}</p>
                        <p><strong>國家：</strong> {product.country}</p>
                    </div>
                )) : <p>沒有商品資訊</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 