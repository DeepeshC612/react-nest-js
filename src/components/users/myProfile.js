import {
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  notification,
  Image,
  Upload,
  Tooltip,
} from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getEnv } from "../../config/config";
import { useNavigate } from "react-router-dom";
import SideBar from "../common/sideBar";
import { Content, Header } from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";

export default function MyProfile() {
  const [api, contextHolder] = notification.useNotification();
  const userData = useSelector((state) => state?.auth?.userData);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNum: "",
    name: "",
  });
  const [orderList, setOrderList] = useState([]);
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
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = () => {
    console.log("hii");
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.post(
          `${getEnv("REACT_APP_API_ENDPOINT")}/order/my-orders`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { status, data } = res?.data;
        if (status) {
          if (data?.length) {
            setOrderList(data);
          }
        }
      } catch (err) {
        const data = {
          message: err?.response?.data?.error ?? err?.response?.data?.message,
          type: "error",
        };
        if (data.message === "Unauthorized") {
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
        openNotification(data);
      }
    }
    fetchData();
  }, []);
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
              <div className="position-relative" style={{ marginTop: "-50px" }}>
                <Card style={{ width: "40rem" }}>
                  <Card.Body>
                    <Upload name="profilePic" onChange={(e) => handleChange(e)}>
                      <Tooltip
                        title="Change profile picture"
                        placement="topRight"
                      >
                        <Image
                          src={userData?.profilePic}
                          preview={false}
                          style={{
                            height: "200px",
                            width: "200px",
                            display: "flex",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginLeft: "190px",
                            zIndex: 1,
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    </Upload>
                    <Form
                      form={form}
                      name="address-form"
                      labelCol={{
                        span: 4,
                      }}
                      labelAlign="left"
                      wrapperCol={{
                        span: 20,
                      }}
                      fields={[
                        {
                          name: ["name"],
                          value: `${userData?.name}`,
                        },
                        {
                          name: ["email"],
                          value: `${userData?.email}`,
                        },
                        {
                          name: ["phoneNum"],
                          value: `${userData?.phoneNum}`,
                        },
                      ]}
                      variant="outlined"
                      layout="horizontal"
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <Form.Item name="email" label="Email">
                        <Input disabled/>
                      </Form.Item>
                      <Form.Item name="name" label="Name">
                        <Input onChange={(e) => handleChange(e)}/>
                      </Form.Item>
                      <Form.Item name="password" label="Password">
                        <Input type="password" placeholder="********" onChange={(e) => handleChange(e)}/>
                      </Form.Item>
                      <Form.Item name="phoneNum" label="Phone number">
                        <InputNumber
                          addonBefore="+91"
                          style={{ width: "100%" }}
                          onChange={(e) => handleChange(e)}
                        />
                      </Form.Item>
                    </Form>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ position: "relative" }}
                      onSubmit={handleSubmit}
                      block
                    >
                      Submit
                    </Button>
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
