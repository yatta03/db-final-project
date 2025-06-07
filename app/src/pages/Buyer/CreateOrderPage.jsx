import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setError("Please sign in to post an order.");
      return;
    }
    if (!productName || !country || quantity < 1) {
      setError("Please fill in all fields correctly.");
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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>發佈新需求</h1>
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
          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "提交中..." : "提交訂單"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderPage; 