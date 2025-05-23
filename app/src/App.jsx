import { BrowserRouter as Router, Routes, Route } from "react-router";
import { SupabaseProvider } from "./context/SupabaseProvider";
import "./App.css";

import Home from "./pages/Home";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <>
      <SupabaseProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/signIn" element={<SignInPage />} />
            <Route path="/user/signUp" element={<SignUpPage />} />
            <Route path="/user" element={<UserPage />} />
          </Routes>
        </Router>
      </SupabaseProvider>
    </>
  );
}

export default App;
