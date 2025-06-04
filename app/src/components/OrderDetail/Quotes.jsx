export default function Quotes({ quotes, curUserId, onRemove }) {
  if (!quotes || quotes.length == 0) return <p>無報價</p>;

  return (
    <>
      {/* todo: if complete, mark only the accepted one */}
      {/* tode: if is order owner and not accept, show accept/reject button */}
      {/* agent && sort out owned quote, if not accept, show remove btn*/}
      {quotes.map((q) => {
        const isOwner = q.user_id === curUserId;
        const isPending = q.acceptance_status === "waiting";

        return (
          <div key={(q.bidder_name, q.quotation_date_time)}>
            <p>報價者：{q.bidder_name}</p>
            <p>金額：{q.price}</p>
            <p>時間：{q.quotation_date_time}</p>
            <p>狀態：{q.acceptance_status}</p>

            {isOwner && isPending && <button onClick={() => onRemove(q)}>撤銷報價</button>}
          </div>
        );
      })}
    </>
  );
}
