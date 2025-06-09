import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../../context/SupabaseProvider';

export default function BuyerOrderDetail() {
  const { supabase, session } = useSupabase();
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:users!orders_customer_userid_fkey(userid, name, email, phone, country, address),
          purchaser:users!orders_purchaser_userid_fkey(userid, name, email)
        `)
        .eq('order_id', orderId)
        .eq('customer_userid', session.user.id)
        .single();

      if (orderError) {
        if (orderError.code === 'PGRST116') {
             setMessage({ type: 'error', text: '找不到訂單或您無權訪問此訂單。' });
             setOrder(null);
        } else {
            throw orderError;
        }
      } else {
        setOrder(orderData);
      }
      
      if (!orderData) {
        setLoading(false);
        return;
      }

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('product_name, quantity, country')
        .eq('order_id', orderId);

      if (productsError) {
        throw productsError;
      }
      setProducts(productsData || []);

    } catch (error) {
      console.error('Error fetching order details:', error);
      setMessage({ type: 'error', text: `讀取訂單資料失敗：${error.message}` });
    } finally {
      setLoading(false);
    }
  }, [orderId, session, supabase]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  const pageStyle = {
    maxWidth: '800px',
    margin: '3rem auto',
    padding: '2.5rem',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f4f7f6',
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
    color: type === 'error' ? '#721c24' : '#155724',
    backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
    border: `1px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'}`,
    textAlign: 'center',
  });

  const detailSectionStyle = {
    marginBottom: '1.5rem',
    padding: '1.5rem',
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
  
  const backLinkStyle = {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      display: 'inline-block',
      textDecoration: 'none',
      marginBottom: '1.5rem',
  };

  const markReceivedButtonStyle = {
    marginTop: '1.5rem',
    marginLeft: 0,
    backgroundColor: '#28A745',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    zIndex: 1,
    display: 'block',
    position: 'relative',
    left: 0,
    bottom: 0
  };

  const handleMarkAsReceived = async () => {
    if (!order) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from('orders')
        .update({ order_status: 'completed' })
        .eq('order_id', order.order_id);
      if (error) throw error;
      setMessage({ type: 'success', text: '訂單已標記為已收貨！' });
      setTimeout(() => {
        navigate('/buyer/taken-orders');
      }, 800);
    } catch (error) {
      setMessage({ type: 'error', text: '更新訂單狀態失敗：' + error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{...pageStyle, textAlign: 'center'}}><p>正在載入訂單詳情...</p></div>;
  }
  
  return (
    <div style={pageStyle}>
      <Link to="/buyer/taken-orders" style={backLinkStyle}>返回已被接取訂單列表</Link>
      
      {message.text && !order && <p style={messageStyle(message.type)}>{message.text}</p>}

      {!order && !loading && !message.text &&
        <p style={messageStyle('error')}>找不到訂單資料。</p>
      }

      {order && (
        <>
          <h2 style={h2Style}>訂單詳情 #{order.order_id}</h2>
          
          {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}

          <div style={detailSectionStyle}>
            <h3 style={{ marginTop: 0, color: '#007bff' }}>基本資訊</h3>
            <p style={detailItemStyle}><span style={detailLabelStyle}>訂單狀態:</span> {order.order_status || '待處理'}</p>
            <p style={detailItemStyle}><span style={detailLabelStyle}>訂單金額:</span> ${order.amount != null ? order.amount.toFixed(2) : '0.00'}</p>
            <p style={detailItemStyle}><span style={detailLabelStyle}>建立時間:</span> {formatDate(order.created_at)}</p>
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

          {order.purchaser ? (
            <div style={detailSectionStyle}>
              <h3 style={{ marginTop: 0, color: '#007bff' }}>代購者資訊</h3>
              <p style={detailItemStyle}><span style={detailLabelStyle}>姓名:</span> {order.purchaser.name || 'N/A'}</p>
              <p style={detailItemStyle}><span style={detailLabelStyle}>Email:</span> {order.purchaser.email || 'N/A'}</p>
            </div>
          ) : (
            <div style={detailSectionStyle}>
              <h3 style={{ marginTop: 0, color: '#007bff' }}>代購者資訊</h3>
              <p style={detailItemStyle}>尚未有代購者承接此訂單。</p>
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

          {order.order_status === 'in_progress' && (
            <button style={markReceivedButtonStyle} onClick={handleMarkAsReceived}>
              標記為已收貨
            </button>
          )}
        </>
      )}
    </div>
  );
} 