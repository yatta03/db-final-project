import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseProvider';

export default function PublicSellerProfilePage() {
  const { userId } = useParams();
  const { supabase } = useSupabase();
  
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('未指定代購者 ID。');
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch seller info and reviews in parallel
        const [sellerPromise, reviewsPromise] = await Promise.all([
          supabase.from('users').select('name, email, phone, country').eq('userid', userId).single(),
          supabase.from('reviews').select('review_content, publish_date_time').eq('purchaser_user_id', userId).order('publish_date_time', { ascending: false })
        ]);

        if (sellerPromise.error || !sellerPromise.data) {
          throw new Error('找不到該代購者。');
        }
        setSeller(sellerPromise.data);

        if (reviewsPromise.error) {
          throw new Error('讀取評價時發生錯誤：' + reviewsPromise.error.message);
        }
        setReviews(reviewsPromise.data || []);
        
      } catch (e) {
        console.error('Error fetching public profile data:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, supabase]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // --- Styles ---
  const pageStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    fontFamily: '"Segoe UI", sans-serif',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    marginBottom: '2rem',
  };

  const sellerNameStyle = {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1rem',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '1rem',
  };

  const sellerInfoStyle = {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.8',
  };
  
  const infoLabelStyle = {
      fontWeight: '600',
      marginRight: '8px',
      color: '#333',
  };

  const reviewsSectionStyle = {
    ...cardStyle, // Reuse card style for consistency
  };

  const reviewsTitleStyle = {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1.5rem',
  };

  const reviewItemStyle = {
    borderBottom: '1px solid #eee',
    padding: '1.5rem 0',
  };

  const reviewContentStyle = {
    fontSize: '1rem',
    color: '#444',
    marginBottom: '0.75rem',
  };

  const reviewDateStyle = {
    fontSize: '0.85rem',
    color: '#888',
    textAlign: 'right',
  };
  
  const messageStyle = {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#666',
    padding: '2rem',
  };
  
  if (loading) {
    return <div style={pageStyle}><p style={messageStyle}>正在載入代購者資訊...</p></div>;
  }

  if (error) {
    return <div style={pageStyle}><p style={messageStyle}>{error}</p></div>;
  }

  return (
    <div style={pageStyle}>
      {seller && (
        <div style={cardStyle}>
          <h1 style={sellerNameStyle}>{seller.name}</h1>
          <div style={sellerInfoStyle}>
            {/* Developer Note: Exposing email and phone publicly can be a privacy risk. Confirm if this is the desired behavior. */}
            <p><span style={infoLabelStyle}>國家/地區:</span>{seller.country || '未提供'}</p>
            <p><span style={infoLabelStyle}>電子郵件:</span>{seller.email || '未提供'}</p>
            <p><span style={infoLabelStyle}>電話:</span>{seller.phone || '未提供'}</p>
          </div>
        </div>
      )}

      <div style={reviewsSectionStyle}>
        <h2 style={reviewsTitleStyle}>用戶評價</h2>
        {reviews.length > 0 ? (
          <div>
            {reviews.map((review, index) => (
              <div key={index} style={reviewItemStyle}>
                <p style={reviewContentStyle}>" {review.review_content} "</p>
                <p style={reviewDateStyle}>{formatDate(review.publish_date_time)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={messageStyle}>這位代購者暫時還沒有收到任何評價。</p>
        )}
      </div>
    </div>
  );
} 