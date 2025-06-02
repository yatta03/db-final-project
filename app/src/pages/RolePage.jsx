import { Link } from "react-router-dom";

export default function RolePage() {
  return (
    <>
      <p>請選擇身分</p>
      {/* 網址是暫時填的 */}
      <Link to={"/bidder"}>代購者</Link>
      <Link to={"/buyer"}> 買家</Link>
    </>
  );
}
