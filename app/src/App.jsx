import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router";
import { SupabaseProvider } from "./context/SupabaseProvider";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import SignInPage from "./pages/Account/SignInPage";
import SignUpPage from "./pages/Account/SignUpPage";
import RolePage from "./pages/RolePage";
import OrderDetailPage from "./pages/OrderDetail/OrderDetailPage";
import AgentProfilePage from "./pages/agent/AgentProfilePage";
import AgentAcceptedOrdersPage from "./pages/agent/AgentAcceptedOrdersPage";
import AgentOrderDetailPage from "./pages/agent/AgentOrderDetailPage";
import AgentQuotedOrdersPage from "./pages/agent/AgentQuotedOrdersPage";
import AgentCompletedOrdersPage from "./pages/agent/AgentCompletedOrdersPage";
import AgentPublicProfilePage from "./pages/agent/AgentPublicProfilePage";
import AgentBrowseOrdersPage from "./pages/agent/AgentBrowseOrdersPage";

import The_buyer_order_detail from "./pages/Buyer/Buyer_order_detail";
import The_buyer_profile from "./pages/Buyer/Buyer_profile";
import The_buyer_taken from "./pages/Buyer/Buyer_taken";
import The_buyer_complete from "./pages/Buyer/Buyer_complete";
import BuyerPostedOrdersPage from "./pages/Buyer/BuyerPostedOrdersPage";


function App() {
  return (
    <>
      <SupabaseProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/signIn" element={<SignInPage />} />
            <Route path="/user/signUp" element={<SignUpPage />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="/buyer/browse/order/:orderId" element={<OrderDetailPage role={"buyer"} />} />
            <Route path="/agent/browse/order/:orderId" element={<OrderDetailPage role={"agent"} />} />

            {/* Agent-specific private pages (more specific routes first) */}
            <Route path="/agent/browse-orders" element={<AgentBrowseOrdersPage />} />
            <Route path="/agent/profile" element={<AgentProfilePage />} />
            <Route path="/agent/accepted-orders" element={<AgentAcceptedOrdersPage />} />
            <Route path="/agent/quoted-orders" element={<AgentQuotedOrdersPage />} />
            <Route path="/agent/completed-orders" element={<AgentCompletedOrdersPage />} />
            <Route path="/agent/order/:orderId" element={<AgentOrderDetailPage />} />


            <Route path="/buyer/posted-orders" element={<BuyerPostedOrdersPage />} />
            <Route path="/buyer/order/:orderId" element={<The_buyer_order_detail />} />
            <Route path="/buyer/profile" element={<The_buyer_profile />} />
            <Route path="/buyer/taken-orders" element={<The_buyer_taken />} />
            <Route path="/buyer/complete-orders" element={<The_buyer_complete />} />

            {/* Agent-specific dynamic public page (less specific, so placed last) */}
            <Route path="/agent/:userId" element={<AgentPublicProfilePage />} />
          </Routes>
        </BrowserRouter>
      </SupabaseProvider>
    </>
  );
}

export default App;
