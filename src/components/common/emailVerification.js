import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { getEnv } from "../../config/config";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { notification, Spin } from "antd";

export default function EmailVerification() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, SetIsLoading] = useState(false);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);
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
    return otp.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      email: email,
      otp: +event.target.otp.value,
    };
    try {
      const res = await axios.post(
        `${getEnv("REACT_APP_API_ENDPOINT")}/verify-otp`,
        payload
      );
      SetIsLoading(true);
      const { status, message } = res?.data;
      if (status) {
        openNotification({ type: "success", message: message });
        localStorage.clear("email");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      const data = { message: err?.response?.data?.error ?? err?.response?.data?.message, type: "error" };
      openNotification(data);
    }
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
              <Card.Title>Email verification</Card.Title>
              <Card.Text>
                One time password is shared at
                <p style={{ fontWeight: "bold", alignContent: "center" }}>
                  {email}{" "}
                  <p style={{ fontWeight: "normal" }}>
                    Please check your inbox
                  </p>
                </p>
              </Card.Text>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="otp">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="otp"
                    placeholder="Enter one time password"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                <Button
                  style={{ marginTop: "10px" }}
                  variant="primary"
                  type="submit"
                  disabled={!validateForm()}
                >
                  submit
                </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
