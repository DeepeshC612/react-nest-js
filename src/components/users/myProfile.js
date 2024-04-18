import {
  Button,
  Form,
  Input,
  Layout,
  notification,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import axios from "axios";
import { getEnv } from "../../config/config";
import { useNavigate } from "react-router-dom";
import SideBar from "../common/sideBar";
import { Content, Header } from "antd/es/layout/layout";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../slice/auth/auth.slices";
import { Card } from "react-bootstrap";

export default function MyProfile() {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const userData = useSelector((state) => state?.auth?.userData);
  const [formData, setFormData] = useState({
    password: "",
    phoneNum: "",
    name: "",
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "profilePic") {
      setFormData({ ...formData, [name]: e.target.files[0] });
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
      setIsImageSelected(true)
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${getEnv("REACT_APP_API_ENDPOINT")}/user/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, data, message } = res?.data;
      if (status) {
        openNotification({ message: message, type: "success" });
        dispatch(login(data));
      }
    } catch (err) {
      const data = {
        message: err?.response?.data?.error ?? err?.response?.data?.message,
        type: "error",
      };
      if (data?.message === "Unauthorized") {
        navigate("/login");
      }
      openNotification(data);
    }
  };
  return (
    <>
      {contextHolder}
      <Layout>
        <SideBar />
        <Layout
          className="site-layout"
          style={{
            marginLeft: 200,
          }}
        >
          <Header
            style={{
              padding: 0,
              background: "#fff",
            }}
          >
            <p style={{ fontWeight: "bold", marginLeft: "18px" }}>My Profile</p>
          </Header>

          <Content
            style={{
              margin: "10px 16px 0",
              overflow: "initial",
              height: "100vh",
              padding: 20,
              background: "#fff",
            }}
          >
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="position-relative" style={{ marginTop: "-60px" }}>
                <Card style={{ width: "40rem", boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.4)", }}>
                  <Card.Body>
                    <Form
                      name="address-form"
                      onFinish={handleSubmit}
                      labelCol={{
                        span: 4,
                      }}
                      labelAlign="left"
                      wrapperCol={{
                        span: 20,
                      }}
                      initialValues={{
                        email: userData?.email,
                        name: userData?.name,
                        phoneNum: userData?.phoneNum,
                      }}
                      variant="outlined"
                      layout="horizontal"
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <Form.Item>
                        <Tooltip
                          title={isImageSelected ? "New profile picture is selected" : "Change profile picture"}
                          placement="topRight"
                          color={isImageSelected ? "blue" : ""}
                        >
                          <label htmlFor="fileInput">
                            <img
                              src={isImageSelected ? selectedImage : userData?.profilePic}
                              alt="Profile"
                              style={{
                                height: "200px",
                                width: "200px",
                                objectFit: "cover",
                                marginLeft: "190px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                border: isImageSelected ? "3px solid highlight" : "none",
                              }}
                            />
                          </label>
                        </Tooltip>
                        <Input
                          id="fileInput"
                          type="file"
                          name="profilePic"
                          style={{display: "none"}}
                          onChange={(e) => handleChange(e)}
                        ></Input>
                      </Form.Item>
                      <Form.Item name="email" label="Email">
                        <Input disabled />
                      </Form.Item>
                      <Form.Item name="name" label="Name">
                        <Input
                          name="name"
                          onChange={(e) => handleChange(e)}
                          value={formData?.name}
                        />
                      </Form.Item>
                      <Form.Item name="password" label="Password">
                        <Input
                          name="password"
                          type="password"
                          placeholder="********"
                          value={formData?.password}
                          onChange={(e) => handleChange(e)}
                        />
                      </Form.Item>
                      <Form.Item name="phoneNum" label="Phone number">
                        <Input
                          name="phoneNum"
                          type="number"
                          addonBefore="+91"
                          style={{ width: "100%" }}
                          value={formData?.phoneNum}
                          onChange={(e) => handleChange(e)}
                        />
                      </Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ position: "relative" }}
                        block
                      >
                        Submit
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
