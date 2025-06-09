import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabase } from '../../context/SupabaseProvider';

export default function The_buyer_complete() {
  const { supabase, session } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('com-order');

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      if (!session?.user) {
        setMessage({ type: 'error', text: '用戶未登入' });
        setLoading(false);
        return;
      }

      setLoading(true);
      setMessage({ type: '', text: '' });
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            order_id,
            order_status,
            created_at,
            amount,
            purchaser:users!orders_purchaser_userid_fkey(name)
          `)
          .eq('customer_userid', session.user.id)
          .eq('order_status', 'completed')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setCompletedOrders(data);
          if (data.length === 0) {
            setMessage({ type: 'info', text: '目前沒有已完成的訂單' });
          }
        }
      } catch (error) {
        console.error('Error fetching completed orders:', error);
        setMessage({ type: 'error', text: '讀取已完成訂單失敗：' + error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, [session, supabase]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const pageStyle = {
    maxWidth: '900px',
    margin: '1rem auto',
    padding: '2.5rem',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#F4F7F6',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const navStyle = {
    display: 'flex',
    marginBottom: '2.5rem',
    borderBottom: '1px solid #dee2e6',
  };

  const navButtonStyle = (tabName) => ({
    padding: '1rem 1.5rem',
    border: 'none',
    borderBottom: activeTab === tabName ? '3px solid #007bff' : '3px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: activeTab === tabName ? '600' : 'normal',
    color: activeTab === tabName ? '#007bff' : '#495057',
    transition: 'color 0.2s ease-in-out, border-bottom-color 0.2s ease-in-out',
    marginRight: '0.5rem',
    textDecoration: 'none',
  });

  const h2Style = {
    textAlign: 'center',
    color: '#343a40',
    marginBottom: '2rem',
    fontWeight: '600',
  };
  
  const messageStyle = (type) => ({
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '4px',
    color: type === 'info' ? '#0c5460' : '#fff',
    backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#d1ecf1',
    textAlign: 'center',
    border: type === 'info' ? '1px solid #bee5eb' : 'none',
  });

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
  };

  const listItemStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  };

  const detailItemStyle = {
    marginBottom: '0.5rem',
    color: '#495057',
  };
  
  const detailLabelStyle = {
    fontWeight: '600',
    color: '#343a40',
  };

  if (loading && completedOrders.length === 0) {
    return <div style={{...pageStyle, textAlign: 'center'}}><p>正在載入已完成訂單...</p></div>;
  }

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <Link to="/buyer/profile" style={navButtonStyle('account')} onClick={() => setActiveTab('account')}>帳戶資訊</Link>
        <Link to="/buyer/taken-orders" style={navButtonStyle('tak_order')} onClick={() => setActiveTab('tak_order')}>已被接取訂單</Link>
        <Link to="/buyer/complete-orders" style={navButtonStyle('com_order')} onClick={() => setActiveTab('com_order')}>已完成訂單</Link>      </nav>

      <h2 style={h2Style}>我的已完成訂單</h2>

      {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}

      {completedOrders.length > 0 ? (
        <ul style={listStyle}>
          {completedOrders.map(order => (
            <li key={order.order_id} style={listItemStyle}>
              <Link to={`/buyer/complete/${order.order_id}`} style={linkStyle}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#007bff' }}>訂單編號 #{order.order_id}</h3>
                <p style={detailItemStyle}><span style={detailLabelStyle}>代購者姓名：</span>{order.purchaser?.name || 'N/A'}</p>
                <p style={detailItemStyle}><span style={detailLabelStyle}>訂單金額：</span>${order.amount ?? 'N/A'}</p>
                <p style={detailItemStyle}><span style={detailLabelStyle}>訂單日期：</span>{formatDate(order.created_at)}</p>
                <p style={detailItemStyle}><span style={detailLabelStyle}>訂單狀態：</span>{order.order_status}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
} 