import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { getEnv } from "../../config/config";
import axios from "axios";
import { login } from "../../slice/auth/auth.slices";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { notification, Spin } from "antd";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, SetIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isVerified, setVerified] = useState(false)
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch()
  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
    });
  };

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    try {
      if(isVerified) {
        const res = await axios.post(
          `${getEnv("REACT_APP_API_ENDPOINT")}/login`,
          payload
        );
        const { status, data, access_token } = res?.data;
        if (status) {
          SetIsLoading(true);
          openNotification({ type: "success", message: "Login success" });
          dispatch(login(data));
          localStorage.clear();
          localStorage.setItem("token", access_token);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } else {
        openNotification({ type: "error", message: "Please verify captcha" });
      }
    } catch (err) {
      const data = { message: err?.response?.data?.error ?? err?.response?.data?.message, type: "error" };
      openNotification(data);
    }
  }

  const handleVerification = (token) => {
    if(token) {
      setVerified(true)
    }
  }
  function handleSignup() {
    navigate("/signup");
  }

  return (
    <div>
      {contextHolder}
      <div
        className="spinner-container"
        style={{
          position: "fixed",
          top: "0",
          left: "50%",
        }}
      >
        {isLoading && <Spin indicator={antIcon} />}
      </div>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="position-relative">
          <Card style={{ width: "25rem" }}>
            <Card.Body>
              <Card.Title>Login</Card.Title>
              <div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Card.Text style={{ marginTop: "5px", marginBottom: "5px" }}>
                  <Card.Link href="http://localhost:3000/forgot-password">
                    forgot password!
                  </Card.Link>
                </Card.Text>
                <div>
                  <HCaptcha
                  sitekey={process.env.REACT_APP_SITE_KEY}
                  onVerify={handleVerification}
                  />
                </div>
                <Button
                  // style={{ marginTop: "10px" }}
                  variant="info"
                  type="submit"
                  disabled={!validateForm()}
                >
                  Login
                </Button>
              </Form>
              <div style={{marginLeft: "88px", marginTop: "-39px"}}>
                <Button
                  style={{ marginTop: "0", marginLeft: "0px" }}
                  variant="secondary"
                  type="submit"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
