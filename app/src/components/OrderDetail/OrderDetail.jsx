export default function OrderDetail({ orderData }) {
  if (!orderData) return <p>no data</p>;

  return (
    <>
      <h3>訂單 #{orderData.order_id}</h3>
      <p>發布者：{orderData.customer_name}</p>
      <p>ID: {orderData.customer_userid}</p>
      <p>發布時間：{orderData.created_at}</p>

      <h3>商品: </h3>
      {orderData.products?.map((p) => {
        return (
          <div key={p.product_id}>
            <p>商品 #{p.product_id}</p>
            <p>商品名稱: {p.product_name}</p>
            <p>數量: {p.quantity}</p>
            {p.country && <p>產地：{p.country}</p>}
          </div>
        );
      })}
    </>
  );
}
