import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useSelector } from "react-redux";

const Login = React.lazy(() => import("./components/Auth/login"));
const Signup = React.lazy(() => import("./components/Auth/signup"));
const EmailVerification = React.lazy(() =>
  import("./components/Auth/emailVerification")
);
const ForgotPassword = React.lazy(() =>
  import("./components/users/forgotPassword")
);
const ResetPassword = React.lazy(() =>
  import("./components/users/resetPassword")
);
const Dashboard = React.lazy(() => import("./components/product/dashboard"));
const Checkout = React.lazy(() => import("./components/cart/checkout"));
const MyOrder = React.lazy(() => import("./components/cart/myOrder"));
const MyProfile = React.lazy(() => import("./components/users/myProfile"));
function App() {
  const userData = useSelector((state) => state?.auth?.userData);
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  return (
    <Router>
      <Suspense
        fallback={
          <div
            className="spinner-container"
            style={{
              position: "fixed",
              top: "0",
              left: "50%",
            }}
          >
            <Spin indicator={antIcon} />
          </div>
        }
      >
        <Routes>
          {userData?.role === "admin" ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/confirm-email" element={<EmailVerification />} />
              <Route path="/confirm-email" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<MyProfile />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/confirm-email" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-order" element={<MyOrder />} />
              <Route path="/profile" element={<MyProfile />} />
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
