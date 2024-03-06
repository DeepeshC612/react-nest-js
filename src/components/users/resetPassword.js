import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Card } from "react-bootstrap";
import { getEnv } from "../../config/config";
import axios from "axios";
import { notification } from "antd";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
      duration: 0,
    });
  };

  function validateForm() {
    return password.length > 0 && confirmPass.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      password: event.target.password.value,
      confirmPassword: event.target.confirmPass.value,
    };
    try {
      const res = await axios.post(
        `${getEnv("REACT_APP_API_ENDPOINT")}/user/reset-password`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, message } = res?.data;
      if (status) {
        openNotification({ type: "success", message: message });
      }
    } catch (err) {
      const data = {
        message: err?.response?.data?.error ?? err?.response?.data?.message,
        type: "error",
      };
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
              <Card.Title>Reset password</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Label>New password</Form.Label>
                <Form.Group controlId="password" style={{ marginTop: "10px" }}>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Label>Confirm password</Form.Label>
                <Form.Group controlId="confirmPass">
                  <Form.Control
                    type="confirmPass"
                    placeholder="Confirm password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
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
