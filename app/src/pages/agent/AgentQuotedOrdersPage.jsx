import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabase } from '../../context/SupabaseProvider';

export default function AgentQuotedOrdersPage() {
  const { supabase, session } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [quotedOrders, setQuotedOrders] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('quoted-orders'); // Set active tab

  useEffect(() => {
    const fetchQuotedOrders = async () => {
      if (!session?.user) {
        setMessage({ type: 'error', text: '用戶未登入' });
        setLoading(false);
        return;
      }

      setLoading(true);
      setMessage({ type: '', text: '' });
      try {
        // Fetch quotes made by the agent with 'waiting' status,
        // join with orders that are not yet accepted,
        // and join with users to get customer name.
        const { data, error } = await supabase
          .from('quotes')
          .select(`
            order_id,
            price,
            quotation_date_time,
            acceptance_status,
            order:orders!inner (
              order_id,
              created_at,
              is_order_accepted,
              customer:users!orders_customer_userid_fkey (name)
            )
          `)
          .eq('user_id', session.user.id)
          .eq('acceptance_status', 'waiting')
          .eq('order.is_order_accepted', false); // Ensure the order itself is not yet accepted by anyone

        if (error) {
          throw error;
        }

        if (data) {
          setQuotedOrders(data.map(q => ({
            order_id: q.order.order_id,
            customer_name: q.order.customer?.name || 'N/A',
            quote_price: q.price,
            quote_date: q.quotation_date_time,
            quote_status: q.acceptance_status,
            order_created_at: q.order.created_at
          })));
          if (data.length === 0) {
            setMessage({ type: 'info', text: '目前沒有待回覆的報價' });
          }
        }
      } catch (error) {
        console.error('Error fetching quoted orders:', error);
        setMessage({ type: 'error', text: '讀取待回覆報價失敗：' + error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotedOrders();
  }, [session, supabase]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(); // Using toLocaleString for date and time
  };

  // Styles (can be shared or adjusted)
  const pageStyle = {
    maxWidth: '900px',
    margin: '1rem auto',
    padding: '2.5rem',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#ffffff',
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

  const orderListStyle = {
    listStyleType: 'none',
    padding: 0,
  };

  const orderItemStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease-in-out, boxShadow 0.2s ease-in-out',
  };

  const orderLinkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };
  
  const orderDetailsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
    marginTop: '0.5rem',
  };
  
  const orderDetailStyle = {
    color: '#495057',
  };
  
  const orderDetailLabelStyle = {
    fontWeight: '600',
    color: '#343a40',
  };

  if (loading && quotedOrders.length === 0) {
    return <div style={{...pageStyle, textAlign: 'center'}}><p>正在載入待回覆報價...</p></div>;
  }

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <Link to="/agent/profile" style={navButtonStyle('account')} onClick={() => setActiveTab('account')}>帳戶資訊</Link>
        <Link to="/agent/accepted-orders" style={navButtonStyle('accepted-orders')} onClick={() => setActiveTab('accepted-orders')}>已接訂單</Link>
        <Link to="/agent/quoted-orders" style={navButtonStyle('quoted-orders')} onClick={() => setActiveTab('quoted-orders')}>已報價訂單</Link>
        <Link to="/agent/completed-orders" style={navButtonStyle('completed-orders')} onClick={() => setActiveTab('completed-orders')}>已完成訂單</Link>
      </nav>

      <h2 style={h2Style}>我的待回覆報價</h2>

      {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}

      {quotedOrders.length > 0 ? (
        <ul style={orderListStyle}>
          {quotedOrders.map(quote => (
            <li 
              key={quote.order_id + '-' + quote.quote_date} 
              style={orderItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <Link to={`/agent/order/${quote.order_id}`} style={orderLinkStyle}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#007bff' }}>訂單編號 #{quote.order_id}</h3>
                <div style={orderDetailsContainerStyle}>
                  <p style={orderDetailStyle}><span style={orderDetailLabelStyle}>客戶姓名：</span>{quote.customer_name}</p>
                  <p style={orderDetailStyle}><span style={orderDetailLabelStyle}>您的報價金額：</span>${quote.quote_price}</p>
                  <p style={orderDetailStyle}><span style={orderDetailLabelStyle}>報價狀態：</span>{quote.quote_status}</p>
                  <p style={orderDetailStyle}><span style={orderDetailLabelStyle}>報價日期：</span>{formatDate(quote.quote_date)}</p>
                  <p style={orderDetailStyle}><span style={orderDetailLabelStyle}>原始訂單日期：</span>{formatDate(quote.order_created_at)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !message.text && <p style={{textAlign: 'center'}}>目前沒有待回覆的報價。</p>
      )}
    </div>
  );
} 