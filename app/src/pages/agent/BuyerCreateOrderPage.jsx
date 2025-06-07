import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseProvider';
import { useNavigate, Link } from 'react-router-dom';

export default function BuyerCreateOrderPage() {
  const { supabase, session } = useSupabase();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('create-order');

  useEffect(() => {
    if (!session?.user) {
      setMessage({ type: 'error', text: '請先登入才能建立訂單。' });
    }
  }, [session]);

  const handleAddProduct = () => {
    setProducts(prev => [...prev, {
      product_name: '', quantity: 1, product_image_path: '', country: ''
    }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleRemove = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!session?.user) {
      setMessage({ type: 'error', text: '用戶未登入' });
      return;
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ customer_userid: session.user.id })
        .select('order_id')
        .single();

      if (orderError) throw orderError;

      const { error: productError } = await supabase.from('products').insert(
        products.map(p => ({ ...p, order_id: order.order_id }))
      );

      if (productError) throw productError;

      setMessage({ type: 'success', text: '訂單已建立成功！' });
      setProducts([]);
      navigate('/buyer/published-orders');
    } catch (err) {
      setMessage({ type: 'error', text: '建立失敗：' + err.message });
    }
  };

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <Link to="/buyer/create-order" style={navButtonStyle('create-order')} onClick={() => setActiveTab('create-order')}>建立訂單</Link>
        <Link to="/buyer/published-orders" style={navButtonStyle('published-orders')} onClick={() => setActiveTab('published-orders')}>我的訂單</Link>
      </nav>

      <h2 style={h2Style}>建立新訂單</h2>
      {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}

      <form onSubmit={handleSubmit}>
        {products.map((product, i) => (
          <div key={i} style={listItemStyle}>
            <input value={product.product_name} onChange={e => handleChange(i, 'product_name', e.target.value)} placeholder="商品名稱" className="input" />
            <input type="number" value={product.quantity} onChange={e => handleChange(i, 'quantity', e.target.value)} placeholder="數量" className="input" />
            <input value={product.product_image_path} onChange={e => handleChange(i, 'product_image_path', e.target.value)} placeholder="圖片 URL" className="input" />
            <input value={product.country} onChange={e => handleChange(i, 'country', e.target.value)} placeholder="國家" className="input" />
            <button type="button" onClick={() => handleRemove(i)}>移除</button>
          </div>
        ))}

        <button type="button" onClick={handleAddProduct}>新增商品</button>
        <button type="submit" style={{ marginLeft: '1rem' }}>送出訂單</button>
      </form>
    </div>
  );
}

// 💅 共用樣式與你提供的版本同步
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
  borderBottom: tab === 'create-order' ? '3px solid #007bff' : '3px solid transparent',
  background: 'none', cursor: 'pointer', fontWeight: 'bold',
  color: tab === 'create-order' ? '#007bff' : '#495057',
});

const h2Style = { textAlign: 'center', color: '#343a40', marginBottom: '2rem' };

const messageStyle = (type) => ({
  padding: '1rem', borderRadius: '4px', textAlign: 'center',
  color: type === 'error' ? '#fff' : '#0c5460',
  backgroundColor: type === 'error' ? '#dc3545' : '#d1ecf1',
  marginBottom: '1.5rem'
});

const listItemStyle = {
  backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '5px', marginBottom: '1rem',
};