import { BrowserRouter as Router, Routes, Route } from "react-router";
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

function App() {
  return (
    <>
      <SupabaseProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/signIn" element={<SignInPage />} />
            <Route path="/user/signUp" element={<SignUpPage />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="/buyer/browse/order/:orderId" element={<OrderDetailPage role={"buyer"} />} />
            <Route path="/agent/browse/order/:orderId" element={<OrderDetailPage role={"agent"} />} />

            {/* Agent-specific private pages (more specific routes first) */}
            <Route path="/agent/profile" element={<AgentProfilePage />} />
            <Route path="/agent/accepted-orders" element={<AgentAcceptedOrdersPage />} />
            <Route path="/agent/quoted-orders" element={<AgentQuotedOrdersPage />} />
            <Route path="/agent/completed-orders" element={<AgentCompletedOrdersPage />} />
            <Route path="/agent/order/:orderId" element={<AgentOrderDetailPage />} />

            {/* Agent-specific dynamic public page (less specific, so placed last) */}
            <Route path="/agent/:userId" element={<AgentPublicProfilePage />} />
          </Routes>
        </Router>
      </SupabaseProvider>
    </>
  );
}

export default App;
