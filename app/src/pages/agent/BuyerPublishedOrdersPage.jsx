import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseProvider';
import { Link } from 'react-router-dom';

export default function BuyerPublishedOrdersPage() {
  const { supabase, session } = useSupabase();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('published-orders');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user) {
        setMessage({ type: 'error', text: '請先登入。' });
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('order_id, order_status, created_at, amount')
          .eq('customer_userid', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setOrders(data);
        if (data.length === 0) {
          setMessage({ type: 'info', text: '目前沒有訂單' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: '讀取失敗：' + err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, supabase]);

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <Link to="/buyer/create-order" style={navButtonStyle('create-order')} onClick={() => setActiveTab('create-order')}>建立訂單</Link>
        <Link to="/buyer/published-orders" style={navButtonStyle('published-orders')} onClick={() => setActiveTab('published-orders')}>我的訂單</Link>
      </nav>

      <h2 style={h2Style}>我的已發布訂單</h2>
      {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}

      {orders.length > 0 && (
        <ul style={listStyle}>
          {orders.map(order => (
            <li key={order.order_id} style={listItemStyle}>
              <Link to={`/buyer/browse/order/${order.order_id}`} style={linkStyle}>
                <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>訂單編號 #{order.order_id}</h3>
                <p><strong>金額：</strong>¥{order.amount ?? 'N/A'}</p>
                <p><strong>建立日期：</strong>{new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>狀態：</strong>{order.order_status}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ✅ 共用樣式
const pageStyle = {
  maxWidth: '900px', margin: '1rem auto', padding: '2.5rem',
  fontFamily: '"Segoe UI", Roboto, Arial', backgroundColor: '#fff',
  borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
};

const navStyle = {
  display: 'flex', marginBottom: '2.5rem', borderBottom: '1px solid #dee2e6',
};

const navButtonStyle = (tab) => ({
  padding: '1rem 1.5rem', border: 'none',
  borderBottom: tab === 'published-orders' ? '3px solid #007bff' : '3px solid transparent',
  background: 'none', cursor: 'pointer', fontWeight: 'bold',
  color: tab === 'published-orders' ? '#007bff' : '#495057',
});

const h2Style = { textAlign: 'center', color: '#343a40', marginBottom: '2rem' };

const messageStyle = (type) => ({
  padding: '1rem', borderRadius: '4px', textAlign: 'center',
  color: type === 'error' ? '#fff' : '#0c5460',
  backgroundColor: type === 'error' ? '#dc3545' : '#d1ecf1',
  marginBottom: '1.5rem'
});

const listStyle = { listStyleType: 'none', padding: 0 };
const listItemStyle = {
  backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '6px', marginBottom: '1rem'
};
const linkStyle = { textDecoration: 'none', color: 'inherit', display: 'block' };
