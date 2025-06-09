import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseProvider";
import styles from "./CreateOrderPage.module.css";

const CreateOrderPage = () => {
  const { supabase, session } = useSupabase();
  const navigate = useNavigate();
  
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileChecking, setProfileChecking] = useState(false);

  // 檢查用戶資料是否完整
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!session?.user) return;
      
      setProfileChecking(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('email, phone, country, address')
          .eq('userid', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }
        
        setUserProfile(data);
      } catch (err) {
        console.error('Error checking user profile:', err);
      } finally {
        setProfileChecking(false);
      }
    };

    checkUserProfile();
  }, [session, supabase]);

  // 檢查個人資料是否完整
  const isProfileComplete = () => {
    if (!userProfile) return false;
    
    const requiredFields = ['email', 'phone', 'country', 'address'];
    return requiredFields.every(field => 
      userProfile[field] && userProfile[field].toString().trim() !== ''
    );
  };

  // 獲取缺失的欄位
  const getMissingFields = () => {
    if (!userProfile) return [];
    
    const fieldLabels = {
      email: '電子郵件',
      phone: '電話',
      country: '國家',
      address: '地址'
    };
    
    const missingFields = [];
    for (const [field, label] of Object.entries(fieldLabels)) {
      if (!userProfile[field] || userProfile[field].toString().trim() === '') {
        missingFields.push(label);
      }
    }
    return missingFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setError("請先登入才能發布訂單。");
      return;
    }

    // 檢查基本表單欄位
    if (!productName || !country || quantity < 1) {
      setError("請正確填寫所有欄位。");
      return;
    }

    // 檢查用戶個人資料是否完整
    if (!isProfileComplete()) {
      const missingFields = getMissingFields();
      setError(`發布訂單前請先完善您的收貨資料。缺失欄位：${missingFields.join('、')}。請前往個人資料頁面補充完整資訊。`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Insert into 'orders' table
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({ customer_userid: session.user.id })
        .select()
        .single();

      if (orderError) throw orderError;

      const newOrderId = orderData.order_id;

      // Step 2: Insert into 'products' table
      const { error: productError } = await supabase.from("products").insert({
        order_id: newOrderId,
        product_name: productName,
        quantity: quantity,
        country: country,
      });

      if (productError) throw productError;
      
      // Navigate to the posted orders page on success
      navigate("/buyer/posted-orders");

    } catch (err) {
      setError(err.message);
      console.error("Error creating order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (profileChecking) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>正在檢查資料...</h1>
          <p>請稍候</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>發佈新需求</h1>
        
        {/* 資料完整性提示 */}
        {userProfile && !isProfileComplete() && (
          <div className={styles.warningBox}>
            <h3>⚠️ 個人資料未完整</h3>
            <p>您的個人資料還缺少以下資訊：<strong>{getMissingFields().join('、')}</strong></p>
            <p>發布訂單前請先完善您的收貨資料，以便代購者聯繫您。</p>
            <Link to="/buyer/profile" className={styles.profileLink}>
              前往個人資料頁面 →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="productName">商品名稱</label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">數量</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              min="1"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="country">國家</label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>付款方式</label>
              <p>貨到付款</p>
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <button 
            type="submit" 
            disabled={loading || !isProfileComplete()} 
            className={styles.submitButton}
          >
            {loading ? "提交中..." : "提交訂單"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderPage; 