import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSupabase } from '../../context/SupabaseProvider';

export default function The_buyer_order_detai() {
  const { supabase, session } = useSupabase();
  const { orderId } = useParams();
  
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]); // State for products
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
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:users!orders_customer_userid_fkey(userid, name, email, phone, country, address),
          purchaser:users!orders_purchaser_userid_fkey(userid, name, email)
        `)
        .eq('order_id', orderId)
        .eq('purchaser_userid', session.user.id)
        .single();

      if (orderError) {
        throw orderError;
      }

      if (orderData) {
        setOrder(orderData);
      } else {
        setMessage({ type: 'error', text: '找不到訂單或無權訪問。' });
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
  }, [orderId, session, supabase]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleMarkAsShipped = async () => {
    if (!order || order.order_status !== 'in_progress') {
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
      
      setMessage({ type: 'success', text: '訂單狀態已更新為處理中！' });
      await fetchOrderDetails(); 

    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage({ type: 'error', text: `更新訂單狀態失敗：${error.message}` });
    } finally {
      setIsUpdating(false);
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
    backgroundColor: '#c0c0c0',
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

  const productItemStyle = {
    ...detailItemStyle,
    paddingLeft: '1rem',
    borderLeft: '3px solid #007bff',
    marginLeft: '0.5rem'
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
        <Link to="/buyer/taken-orders" style={backLinkStyle}>返回已被接取訂單列表</Link>
        <h2 style={h2Style}>訂單詳情</h2>
        {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}
      </div>
    );
  }
  
  if (!order) return null; // Should be covered by above, but as a fallback

  return (
    <div style={pageStyle}>
      <Link to="/buyer/taken-orders" style={backLinkStyle}>返回已被接取訂單列表</Link>
      <h2 style={h2Style}>訂單詳情 #{order.order_id}</h2>

      {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}

      <div style={detailSectionStyle}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>基本資訊</h3>
        <p style={detailItemStyle}><span style={detailLabelStyle}>訂單編號:</span> {order.order_id}</p>
        <p style={detailItemStyle}><span style={detailLabelStyle}>訂單狀態:</span> {order.order_status}</p>
        <p style={detailItemStyle}><span style={detailLabelStyle}>訂單金額:</span> ${order.amount != null ? order.amount.toFixed(2) : 'N/A'}</p>
        <p style={detailItemStyle}><span style={detailLabelStyle}>創建時間:</span> {formatDate(order.created_at)}</p>
        <p style={detailItemStyle}><span style={detailLabelStyle}>接受狀態:</span> {order.is_order_accepted ? '已接受' : '待接受'}</p>
        <p style={detailItemStyle}><span style={detailLabelStyle}>訂單狀態:</span> {order.order_status}</p>
        {/* Add other relevant Order fields here */}
      </div>

      {products.length > 0 && (
        <div style={detailSectionStyle}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>商品資訊</h3>
          {products.map((product, index) => (
            <div key={index} style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: index < products.length -1 ? '1px dashed #ced4da' : 'none' }}>
              <p style={productItemStyle}><span style={detailLabelStyle}>商品名稱:</span> {product.product_name}</p>
              <p style={productItemStyle}><span style={detailLabelStyle}>數量:</span> {product.quantity}</p>
              <p style={productItemStyle}><span style={detailLabelStyle}>國家:</span> {product.country || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}

      {order.purchaser && (
        <div style={detailSectionStyle}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>代購者資訊</h3>
          <p style={detailItemStyle}><span style={detailLabelStyle}>代購者姓名:</span> {order.purchaser.name || 'N/A'}</p>
          <p style={detailItemStyle}><span style={detailLabelStyle}>代購者Email:</span> {order.purchaser.email || 'N/A'}</p>
        </div>
      )}
      
      {order.order_status === 'in_progress' && (
        <button 
          onClick={handleMarkAsShipped} 
          disabled={isUpdating}
          style={isUpdating ? disabledButtonStyle : actionButtonStyle}
        >
          {isUpdating ? '更新中...' : '標記為已收貨'}
        </button>
      )}
    </div>
  );
} 