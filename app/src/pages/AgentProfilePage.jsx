import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseProvider'; // 假設 SupabaseProvider 在 context 資料夾中

export default function AgentProfilePage() { // <--- 已將 UserProfilePage 更新為 AgentProfilePage
  const { supabase, session } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    userid: '',
    name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
  });
  const [message, setMessage] = useState(''); // 用於顯示成功或失敗訊息
  const [activeTab, setActiveTab] = useState('account'); // 'account', 'orders', 'quotes'

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        setLoading(true);
        setMessage('');
        try {
          const { data, error } = await supabase
            .from('users') // Supabase 中的用戶表名
            .select('*')
            .eq('userid', session.user.id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            setUserData({
              userid: data.userid,
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              country: data.country || '',
              address: data.address || '',
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setMessage({ type: 'error', text: '讀取用戶資料失敗：' + error.message });
        } finally {
          setLoading(false);
        }
      } else {
        setMessage({ type: 'error', text: '用戶未登入' });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, supabase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      setMessage({ type: 'error', text: '用戶未登入，無法保存' });
      return;
    }

    setLoading(true);
    setMessage('');

    // 準備要更新的資料，不包含 userid
    const { userid: _userid, ...updateData } = userData;

    if (!updateData.name || !updateData.email) {
      setMessage({ type: 'error', text: '姓名和電子郵件為必填欄位。' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('userid', session.user.id);

      if (error) {
        throw error;
      }
      setMessage({ type: 'success', text: '用戶資料更新成功！' });
    } catch (error) {
      console.error('Error updating user data:', error);
      setMessage({ type: 'error', text: '更新用戶資料失敗：' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Inline styles
  const pageStyle = {
    maxWidth: '700px',
    margin: '3rem auto',
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
  });

  const formGroupStyle = {
    display: 'grid',
    gridTemplateColumns: '140px 1fr', // Label column and Input column
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    textAlign: 'right',
    color: '#343a40',
    fontWeight: '500',
    paddingRight: '1rem', // Space between label and input
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  };
  // Add this to your styles section for focus effect
  // :focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); }

  const disabledInputStyle = {
    ...inputStyle,
    backgroundColor: '#e9ecef',
    cursor: 'not-allowed',
  };

  const buttonStyle = {
    padding: '0.75rem 2rem',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s ease-in-out',
    display: 'block', // Make button block to center it
    margin: '1.5rem auto 0 auto', // Center the button
  };
  // Add :hover { background-color: #218838; }

  const messageStyle = (type) => ({
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '4px',
    color: '#fff',
    backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
    textAlign: 'center',
  });
  
  const h2Style = {
    textAlign: 'center',
    color: '#343a40',
    marginBottom: '2rem',
    fontWeight: '600',
  };

  if (loading && !Object.values(userData).some(val => val !== '')) {
    return <div style={{...pageStyle, textAlign: 'center'}}><p>正在載入用戶資料...</p></div>;
  }

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <button style={navButtonStyle('account')} onClick={() => setActiveTab('account')}>帳戶資訊</button>
        <button style={navButtonStyle('orders')} onClick={() => { setActiveTab('orders'); alert('功能待開發'); }}>已接訂單</button>
        <button style={navButtonStyle('quotes')} onClick={() => { setActiveTab('quotes'); alert('功能待開發'); }}>已報價訂單</button>
      </nav>

      <h2 style={h2Style}>帳戶資訊</h2>
      {message && <p style={messageStyle(message.type)}>{message.text}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="userid" style={labelStyle}>用戶ID (User ID)</label>
          <input
            type="text"
            id="userid"
            name="userid"
            value={userData.userid}
            style={disabledInputStyle}
            disabled
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="name" style={labelStyle}>姓名 (Name)</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            style={inputStyle} // Apply general input style, add :focus pseudo-class via CSS file or more complex JS if needed
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="email" style={labelStyle}>電子郵件 (Email)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="phone" style={labelStyle}>電話 (Phone)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="country" style={labelStyle}>國家 (Country)</label>
          <input
            type="text"
            id="country"
            name="country"
            value={userData.country}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="address" style={labelStyle}>地址 (Address)</label>
          <textarea
            id="address"
            name="address"
            value={userData.address}
            onChange={handleChange}
            rows="3"
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle} disabled={loading} 
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'} 
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}>
          {loading && Object.values(userData).some(val => val !== '') ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  );
} 