import { formatDate } from "../../utils/dateFormat";

export default function OrderDetail({ orderData }) {
  if (!orderData) return <p>no data</p>;

  return (
    <>
      <h2>訂單 #{orderData.order_id}</h2>
      <p>
        發布時間：
        {formatDate(orderData.created_at)}
      </p>

      <div className="detail-item">
        <h3>商品資訊: </h3>
        {orderData.products?.map((p) => {
          return (
            <div key={p.product_id}>
              <p>商品 #{p.product_id}</p>
              <p>商品名稱： {p.product_name}</p>
              <p>數量： {p.quantity}</p>
              {p.country && (
                <p>
                  產地：
                  {p.country}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="detail-item">
        <h3>客戶資訊: </h3>
        <p>
          姓名：
          {orderData.customer_name}
        </p>
        <p>email: {orderData.customer_email}</p>
        <p>電話： {orderData.customer_phone}</p>
        <p>國家： {orderData.customer_country}</p>
        <p>地址： {orderData.customer_address}</p>
      </div>
    </>
  );
}
