import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabase } from '../../context/SupabaseProvider';

export default function AgentOrderDetailPage() {
  const { supabase, session } = useSupabase();
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]); // State for products
  const [agentQuote, setAgentQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchOrderDetails = useCallback(async () => {
    if (!session?.user || !orderId) {
      setMessage({ type: 'error', text: '用戶未登入或訂單 ID 無效。' });
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // Fetch order details first, without checking for purchaser yet
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:users!orders_customer_userid_fkey(userid, name, email, phone, country, address),
          purchaser:users!orders_purchaser_userid_fkey(userid, name, email)
        `)
        .eq('order_id', orderId)
        .single();

      if (orderError) {
        throw orderError;
      }

      if (orderData) {
        const isPurchaser = orderData.purchaser_userid === session.user.id;

        if (isPurchaser) {
          setOrder(orderData);
        } else {
          // If not the purchaser, check if the agent has a quote on this order
          // and fetch the quote price at the same time.
          const { data: quoteData, error: quoteError } = await supabase
            .from('quotes')
            .select('price')
            .eq('order_id', orderId)
            .eq('user_id', session.user.id)
            .single();

          if (quoteError && quoteError.code !== 'PGRST116') { // Ignore "no rows" error, handle below
            throw quoteError;
          }

          if (quoteData) {
            setAgentQuote(quoteData); // Store the quote for display
            setOrder(orderData);
          } else {
            setMessage({ type: 'error', text: '找不到訂單或無權訪問。' });
            setLoading(false);
            return;
          }
        }
      } else {
        setMessage({ type: 'error', text: '找不到訂單。' });
        setLoading(false);
        return; // Stop if order not found
      }

      // Fetch product details for the order
      const { data: productsData, error: productsError } = await supabase
        .from('products') // Corrected table name to 'products'
        .select('product_name, quantity, country')
        .eq('order_id', orderId);

      if (productsError) {
        throw productsError;
      }
      setProducts(productsData || []);

    } catch (error) {
      console.error('Error fetching order details or products:', error);
      setMessage({ type: 'error', text: `讀取訂單資料失敗：${error.message}` });
    } finally {
      setLoading(false);
    }
  }, [orderId, session, supabase, navigate]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleMarkAsShipped = async () => {
    if (!order || order.order_status !== 'pending') {
      setMessage({ type: 'error', text: '訂單狀態不正確，無法標記為已出貨。' });
      return;
    }

    setIsUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: 'in_progress' })
        .eq('order_id', orderId);

      if (error) {
        throw error;
      }
      
      setMessage({ type: 'success', text: '訂單狀態已更新為已出貨！' });
      await fetchOrderDetails(); 

    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage({ type: 'error', text: `更新訂單狀態失敗：${error.message}` });
    } finally {
      setIsUpdating(false);
    }
  };

  const withdrawQuote = async () => {
    if (!order) return;
    
    const confirmed = window.confirm("您確定要撤銷此報價嗎？此操作無法復原。");
    if (!confirmed) return;

    setIsUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('order_id', order.order_id)
        .eq('user_id', session.user.id);

      if (error) {
        throw error;
      }
      
      setMessage({ type: 'success', text: '報價已成功撤銷。' });
      navigate('/agent/quoted-orders');

    } catch (error) {
      console.error('Error withdrawing quote:', error);
      setMessage({ type: 'error', text: `撤銷報價失敗：${error.message}` });
      setIsUpdating(false);
    }
  };

  const translateOrderStatus = (status) => {
    switch (status) {
      case 'pending':
        return '待出貨';
      case 'in_progress':
        return '已出貨';
      case 'complete':
        return '完成';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  // Styles (can be moved to a CSS file or styled-components)
  const pageStyle = {
    maxWidth: '800px',
    margin: '3rem auto',
    padding: '2.5rem',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

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
    color: type === 'info' ? '#0c5460' : (type === 'error' ? '#721c24' : '#155724'),
    backgroundColor: type === 'info' ? '#d1ecf1' : (type === 'error' ? '#f8d7da' : '#d4edda'),
    border: `1px solid ${type === 'info' ? '#bee5eb' : (type === 'error' ? '#f5c6cb' : '#c3e6cb')}`,
    textAlign: 'center',
  });

  const detailSectionStyle = {
    marginBottom: '1.5rem',
    padding: '1rem',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa'
  };

  const detailItemStyle = {
    marginBottom: '0.8rem',
    fontSize: '1rem',
    color: '#495057',
  };

  const detailLabelStyle = {
    fontWeight: '600',
    color: '#343a40',
    marginRight: '0.5em',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease-in-out',
    marginRight: '1rem',
  };
  
  const backLinkStyle = {
      ...buttonStyle,
      backgroundColor: '#6c757d',
      display: 'inline-block',
      textDecoration: 'none',
      marginBottom: '1.5rem',
  };

  const actionButtonStyle = {
    ...buttonStyle,
    background: '#28a745',
    display: 'block',
    width: 'fit-content',
    margin: '1rem 0',
  };
  
  const disabledButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  };


  if (loading) {
    return <div style={{...pageStyle, textAlign: 'center'}}><p>正在載入訂單詳情...</p></div>;
  }

  if (!order && !loading) {
    return (
      <div style={pageStyle}>
        <button onClick={() => navigate(-1)} style={backLinkStyle}>返回上一頁</button>
        <h2 style={h2Style}>訂單詳情</h2>
        {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}
      </div>
    );
  }
  
  if (!order) return null; // Should be covered by above, but as a fallback

  return (
    <div style={pageStyle}>
      <button onClick={() => navigate(-1)} style={backLinkStyle}>返回上一頁</button>
      <h2 style={h2Style}>訂單詳情 #{order.order_id}</h2>

      {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}

      <div style={detailSectionStyle}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>基本資訊</h3>
        <p style={detailItemStyle}><span style={detailLabelStyle}>訂單編號:</span> {order.order_id}</p>
        {order.is_order_accepted ? (
          <>
            <p style={detailItemStyle}><span style={detailLabelStyle}>訂單狀態:</span> {translateOrderStatus(order.order_status)}</p>
            <p style={detailItemStyle}><span style={detailLabelStyle}>訂單金額:</span> ${order.amount != null ? order.amount.toFixed(2) : 'N/A'}</p>
          </>
        ) : (
          agentQuote && (
            <p style={detailItemStyle}>
              <span style={detailLabelStyle}>您的報價金額:</span> ${agentQuote.price != null ? agentQuote.price.toFixed(2) : 'N/A'}
            </p>
          )
        )}
        <p style={detailItemStyle}><span style={detailLabelStyle}>創建時間:</span> {formatDate(order.created_at)}</p>
        <p style={detailItemStyle}><span style={detailLabelStyle}>接受狀態:</span> {order.is_order_accepted ? '已接受' : '待接受'}</p>
      </div>

      {products.length > 0 && (
        <div style={detailSectionStyle}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>商品資訊</h3>
          {products.map((product, index) => (
            <div key={index} style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: index < products.length -1 ? '1px dashed #ced4da' : 'none' }}>
              <p style={detailItemStyle}><span style={detailLabelStyle}>商品名稱:</span> {product.product_name}</p>
              <p style={detailItemStyle}><span style={detailLabelStyle}>數量:</span> {product.quantity}</p>
              <p style={detailItemStyle}><span style={detailLabelStyle}>國家:</span> {product.country || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}

      {order.customer && (
        <div style={detailSectionStyle}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>客戶資訊</h3>
          <p style={detailItemStyle}><span style={detailLabelStyle}>客戶姓名:</span> {order.customer.name || 'N/A'}</p>
          <p style={detailItemStyle}><span style={detailLabelStyle}>客戶Email:</span> {order.customer.email || 'N/A'}</p>
          <p style={detailItemStyle}><span style={detailLabelStyle}>客戶電話:</span> {order.customer.phone || 'N/A'}</p>
          <p style={detailItemStyle}><span style={detailLabelStyle}>送貨國家:</span> {order.customer.country || 'N/A'}</p>
          <p style={detailItemStyle}><span style={detailLabelStyle}>送貨地址:</span> {order.customer.address || 'N/A'}</p>
        </div>
      )}

      {order.purchaser && (
        <div style={detailSectionStyle}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>代購者資訊</h3>
          <p style={detailItemStyle}><span style={detailLabelStyle}>代購者姓名:</span> {order.purchaser.name || 'N/A'}</p>
          <p style={detailItemStyle}><span style={detailLabelStyle}>代購者Email:</span> {order.purchaser.email || 'N/A'}</p>
        </div>
      )}
      
      <div style={detailSectionStyle}>
            <h3 style={{ marginTop: 0, color: '#007bff' }}>付款方式</h3>
            <div style={detailItemStyle}>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  defaultChecked
                  disabled
                  style={{ marginRight: '0.5rem' }}
                />
                貨到付款
              </label>
            </div>
      </div>

      {order.order_status === 'pending' && (
        <button 
          onClick={handleMarkAsShipped} 
          disabled={isUpdating}
          style={isUpdating ? disabledButtonStyle : actionButtonStyle}
        >
          {isUpdating ? '更新中...' : '標記為已出貨'}
        </button>
      )}

      {!order.is_order_accepted && (
        <button
          onClick={withdrawQuote}
          disabled={isUpdating}
          style={isUpdating ? disabledButtonStyle : { ...actionButtonStyle, backgroundColor: '#dc3545' }}
        >
          {isUpdating ? '處理中...' : '撤銷報價'}
        </button>
      )}
    </div>
  );
} 