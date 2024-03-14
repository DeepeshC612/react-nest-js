import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Card } from "react-bootstrap";
import { getEnv } from "../../config/config";
import axios from "axios";
import { notification } from "antd";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
      duration: 0,
    });
  };

  function validateForm() {
    return email.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      email: event.target.email.value,
    };
    try {
      const res = await axios.post(
        `${getEnv("REACT_APP_API_ENDPOINT")}/user/forget-password`,
        payload
      );
      const { status, message } = res?.data;
      if (status) {
        openNotification({ type: "success", message: message });
      }
    } catch (err) {
      const data = { message: err?.response?.data?.error ?? err?.response?.data?.message, type: "error" };
      openNotification(data);
    }
  }

  return (
    <div>
      {contextHolder}
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="position-relative">
          <Card style={{ width: "25rem" }}>
            <Card.Body>
              <Card.Title>Forgot password</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Label>
                  Enter the email address associate with your account and we'll
                  send you a link to reset password
                </Form.Label>
                <Form.Group controlId="email" style={{ marginTop: "10px" }}>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
