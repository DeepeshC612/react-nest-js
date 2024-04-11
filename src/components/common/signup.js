import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { LoadingOutlined } from "@ant-design/icons";
import { notification, Spin } from "antd";
import { getEnv } from "../../config/config";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNum: "",
    name: "",
  });
  const [isLoading, SetIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
    });
  };

  function validateForm() {
    return formData.email.length > 0;
  }

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "profilePic") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${getEnv("REACT_APP_API_ENDPOINT")}/user/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      SetIsLoading(true);
      const { status, message } = res?.data;
      if (status) {
        openNotification({ message: message, type: "success" });
        localStorage.clear()
        localStorage.setItem('email', formData.email)
        setTimeout(() => {
          navigate("/confirm-email");
        }, 1000);
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
              <Card.Title>Signup</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    name="email"
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
                <Form.Group controlId="phone number">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="phoneNumber"
                    placeholder="Phone number"
                    name="phoneNum"
                    value={formData.phoneNum}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Profile picture</Form.Label>
                  <Form.Control
                    type="file"
                    name="profilePic"
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
                <Button
                  style={{ marginTop: "10px" }}
                  variant="primary"
                  type="submit"
                  disabled={!validateForm()}
                >
                  Signup
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
