import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";

const Login = React.lazy(() => import("./components/common/login"))
const Signup = React.lazy(() => import("./components/common/signup"))
const EmailVerification = React.lazy(() => import("./components/common/emailVerification"))
const ForgotPassword = React.lazy(() => import("./components/users/forgotPassword"))
const ResetPassword = React.lazy(() => import("./components/users/resetPassword"))
function App() {
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
      <Suspense fallback={<div
        className="spinner-container"
        style={{
          position: "fixed",
          top: "0",
          left: "50%",
        }}
      ><Spin indicator={antIcon} /></div>}>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/confirm-email" element={<EmailVerification/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
