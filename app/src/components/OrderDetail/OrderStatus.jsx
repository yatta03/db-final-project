export default function OrderStatus({ orderData, curUserId, role }) {
  return (
    <>
      {/* todo: edit status function in below: 
          if buyer and status="in_progress" -> mark complete
          if agent and status="pending" -> mark in_progress*/}
      {((curUserId == orderData.customer_userid && role == "buyer") || (curUserId == orderData.purchaser_userid && role == "agent")) && (
        <>
          <h3>訂單狀態</h3>
          <p>總金額： {orderData.amount}</p>
          承接狀態： {orderData.is_order_accepted ? "已承接" : "未承接"}, {orderData.order_status}
          {orderData.is_order_accepted && (
            <>
              <p>承接人： {orderData.purchaser_name}</p>
              <p>ID: {orderData.purchaser_userid}</p>
            </>
          )}
        </>
      )}
    </>
  );
}
