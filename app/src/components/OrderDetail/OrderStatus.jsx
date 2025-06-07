export default function OrderStatus({ orderData, curUserId, role }) {
  return (
    <>
      {/* todo: edit status function in below: 
          if buyer and status="in_progress" -> mark complete
          if agent and status="pending" -> mark in_progress*/}
      {((curUserId == orderData.customer_userid && role == "buyer") || (curUserId == orderData.purchaser_userid && role == "agent")) && (
        <>
          <div className="status-item">
            <h3>訂單狀態</h3>
            <p>總金額： {orderData.amount}</p>
            承接狀態： {orderData.is_order_accepted ? "已承接" : "未承接"}, {orderData.order_status}
          </div>

          <div className="status-item">
            {orderData.is_order_accepted && (
              <>
                <h3>代購者資訊</h3>
                <p>姓名： {orderData.purchaser_name}</p>
                <p>email: {orderData.purchaser_email}</p>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
