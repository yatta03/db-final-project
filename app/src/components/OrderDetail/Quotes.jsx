export default function Quotes({ quotes }) {
  if (!quotes || quotes.length == 0) return <p>無報價</p>;
  return (
    <>
      {/* todo: if complete, mark only the accepted one */}
      {/* tode: if is order owner and not accept, show accept/reject button */}
      {quotes.map((q) => {
        return (
          <div key={(q.bidder_name, q.quotation_date_time)}>
            <p>報價者：{q.bidder_name}</p>
            <p>金額：{q.price}</p>
            <p>時間：{q.quotation_date_time}</p>
            <p>狀態：{q.acceptance_status}</p>
          </div>
        );
      })}
    </>
  );
}
