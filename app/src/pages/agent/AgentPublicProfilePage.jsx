import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabase } from '../../context/SupabaseProvider';

export default function AgentPublicProfilePage() {
  const { userId } = useParams();
  const { supabase } = useSupabase();
  
  const [loadingAgent, setLoadingAgent] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [agent, setAgent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('未指定代購者 ID。');
      setLoadingAgent(false);
      setLoadingReviews(false);
      return;
    }

    const fetchAgentProfile = async () => {
      setLoadingAgent(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('name, email, phone, country')
          .eq('userid', userId)
          .single();

        if (error || !data) {
          throw new Error('找不到該代購者的資料。');
        }
        
        setAgent(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching agent profile:', err);
      } finally {
        setLoadingAgent(false);
      }
    };

    const fetchAgentReviews = async () => {
      setLoadingReviews(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('review_content, publish_date_time')
          .eq('purchaser_user_id', userId)
          .order('publish_date_time', { ascending: false });

        if (error) {
          throw error;
        }
        setReviews(data || []);
      } catch (err) {
        setError('讀取評價時發生錯誤。');
        console.error('Error fetching agent reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchAgentProfile();
    fetchAgentReviews();
  }, [userId, supabase]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // --- Styles ---
  const pageStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const errorStyle = {
    ...pageStyle,
    textAlign: 'center',
    color: '#dc3545',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    marginBottom: '2rem',
  };
  
  const headerStyle = {
    color: '#343a40',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '1rem',
  };

  const infoItemStyle = {
    marginBottom: '0.8rem',
    color: '#495057',
    fontSize: '1rem',
  };
  
  const infoLabelStyle = {
    fontWeight: '600',
    color: '#343a40',
    minWidth: '80px',
    display: 'inline-block',
  };
  
  const reviewItemStyle = {
    borderBottom: '1px solid #e9ecef',
    padding: '1.5rem 0',
  };

  const reviewContentStyle = {
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '0.75rem',
  };

  const reviewDateStyle = {
    fontSize: '0.85rem',
    color: '#6c757d',
    textAlign: 'right',
  };


  if (error && !agent) {
    return <div style={errorStyle}><h2>{error}</h2></div>;
  }
  
  return (
    <div style={pageStyle}>
      {/* Agent Info Block */}
      <div style={cardStyle}>
        {loadingAgent ? (
          <p>正在載入代購者資訊...</p>
        ) : agent ? (
          <>
            <h1 style={headerStyle}>{agent.name} 的公開主頁</h1>
            <p style={infoItemStyle}>
              <span style={infoLabelStyle}>國家:</span> {agent.country || '未提供'}
            </p>
            {/* [開發者注意]: 在公開頁面顯示完整的 email 和電話可能有隱私風險，請確認這是否符合業務需求。 */}
            <p style={infoItemStyle}>
              <span style={infoLabelStyle}>Email:</span> {agent.email || '未提供'}
            </p>
            <p style={infoItemStyle}>
              <span style={infoLabelStyle}>電話:</span> {agent.phone || '未提供'}
            </p>
          </>
        ) : null}
      </div>

      {/* Reviews Block */}
      <div style={cardStyle}>
        <h2 style={headerStyle}>歷史評價</h2>
        {loadingReviews ? (
          <p>正在載入評價...</p>
        ) : reviews.length > 0 ? (
          <div>
            {reviews.map((review, index) => (
              <div key={index} style={reviewItemStyle}>
                <p style={reviewContentStyle}>{review.review_content}</p>
                <p style={reviewDateStyle}>{formatDate(review.publish_date_time)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>這位代購者暫時還沒有收到任何評價。</p>
        )}
      </div>
    </div>
  );
} 