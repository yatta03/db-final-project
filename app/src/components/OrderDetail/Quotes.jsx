import { formatDate } from "../../utils/dateFormat";

export default function Quotes({ quotes, curUserId, orderOwnerId, onRemove, onReject, onAccept }) {
  if (!quotes || quotes.length == 0)
    return (
      <div>
        <p>無報價</p>
      </div>
    );

  return (
    <>
      {/* todo: if complete, mark only the accepted one */}
      {quotes.map((q) => {
        const isOwner = q.user_id === curUserId;
        const isPending = q.acceptance_status === "waiting";

        return (
          <div key={(q.bidder_name, q.quotation_date_time)}>
            <p>+ 報價者：{q.bidder_name}</p>
            <p>金額：{q.price}</p>
            <p>時間：{formatDate(q.quotation_date_time)}</p>
            <p>
              狀態：<span style={{ color: q.acceptance_status == "rejected" ? "red" : q.acceptance_status == "accepted" ? "green" : undefined }}>{q.acceptance_status}</span>
            </p>

            {isOwner && isPending && (
              <button onClick={() => onRemove(q)} style={{ marginRight: "1.5rem", marginBottom: ".5rem" }}>
                撤銷報價
              </button>
            )}

            {orderOwnerId == curUserId && isPending && (
              <>
                <button onClick={() => onAccept(q)} style={{ marginRight: "1.5rem", marginBottom: ".5rem" }}>
                  接受
                </button>
                <button onClick={() => onReject(q)}>拒絕</button>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
