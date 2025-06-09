import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabase } from '../../context/SupabaseProvider';

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

  const pageStyle = {
    maxWidth: '1200px',
    margin: '1rem auto',
    padding: '2rem',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '1rem',
  };

  const h2Style = {
    color: '#343a40',
    fontWeight: '600',
  };

  const orderGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%',
  };

  const cardLinkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    height: '100%',
  };
  
  const cardContentStyle = {
    flexGrow: 1,
  };

  const detailItemStyle = {
    marginBottom: '0.75rem',
    fontSize: '0.95rem',
  };

  if (loading) {
    return <div style={{...pageStyle, textAlign: 'center'}}><p>正在載入待接訂單...</p></div>;
  }

  if (error) {
    return <div style={{...pageStyle, textAlign: 'center', color: '#dc3545'}}><p>{error}</p></div>;
  }

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h2 style={h2Style}>待接訂單瀏覽</h2>
      </header>

      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '3rem' }}>目前沒有待處理的訂單。</p>
      ) : (
        <div style={orderGridStyle}>
          {orders.map((order) => (
            <Link to={`/agent/browse/order/${order.order_id}`} key={order.order_id} style={cardLinkStyle}>
              <div style={cardStyle} 
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}>
                <div style={cardContentStyle}>
                    <p style={detailItemStyle}><strong>客戶名稱：</strong> {order.users?.name || 'N/A'}</p>
                    {order.products && order.products.length > 0 ? order.products.map((product, index) => (
                        <div key={index}>
                            <p style={detailItemStyle}><strong>商品名稱：</strong> {product.product_name}</p>
                            <p style={detailItemStyle}><strong>數量：</strong> {product.quantity}</p>
                            <p style={detailItemStyle}><strong>國家：</strong> {product.country}</p>
                        </div>
                    )) : <p>沒有商品資訊</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 