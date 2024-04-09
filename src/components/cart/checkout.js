import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../../config/config";
import axios from "axios";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  notification,
  Spin,
  Layout,
  Button,
  Tooltip,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  DatePicker,
} from "antd";
import { cartAPI } from "../../services/cartApi";
import { useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { useDispatch } from "react-redux";
import { addToCart, orderProduct } from "../../slice/auth/auth.slices";

const { Header, Content, Sider } = Layout;

export default function Checkout() {
  const [form] = Form.useForm();
  const products = useSelector((state) => state?.auth?.order);
  const [subTotal, setSubTotal] = useState(0);
  const [paymentMode, setPaymentMode] = useState({});
  const [isLoading, SetIsLoading] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const cartData = useSelector((state) => state?.auth?.cart);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    SetIsLoading(true);
    async function fetchData() {
      try {
        const product = [];
        cartData?.map((item) => {
          const obj = {
            quantity: item?.quantity,
            productId: item?.productId,
          };
          product.push(obj);
          return null;
        });
        const payload = {
          products: product,
        };
        const res = await axios.post(
          `${getEnv("REACT_APP_API_ENDPOINT")}/order/details`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { status, data } = res?.data;
        if (status) {
          dispatch(orderProduct([...data?.product]));
          setSubTotal(data?.subTotal);
          SetIsLoading(false);
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


  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
      duration: 0,
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

  function truncateText(text, limit) {
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + "....";
  }

  const paymentMethod = async (type) => {
    if (type === "UPI") {
      const obj = {
        UPI: true,
        Card: false,
      };
      setPaymentMode(obj);
    } else if (type === "Card") {
      const obj = {
        UPI: false,
        Card: true,
      };
      setPaymentMode(obj);
    } else {
      setPaymentMode({});
    }
  };

  const handleCart = async (id, value, method) => {
    try {
      const payload = {
        productId: id,
        quantity: Number(value),
      };
      let res;
      if (method === "POST") {
        res = await cartAPI("", token, method, payload);
      } else {
        res = await cartAPI(id, token, method, "");
      }
      if (res) {
        const SubTotal = res.reduce((acc, index) => {
          return +acc + +index?.totalPrice;
        }, 0);
        dispatch(orderProduct([...res]));
        setSubTotal(SubTotal);
        dispatch(addToCart([...res]));
      }
    } catch (err) {
      const data = {
        message: err?.response?.data?.error ?? err?.response?.data?.message,
        type: "error",
      };
      openNotification(data);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await form.validateFields()
      const product = [];
      cartData?.map((item) => {
        const obj = {
          quantity: item?.quantity,
          productId: item?.productId,
        };
        product.push(obj);
        return null;
      });
      const payload = {
        products: product,
      };
      const res = await axios.post(
        `${getEnv("REACT_APP_API_ENDPOINT")}/order/place-order`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, message } = res?.data;
      if (status) {
        openNotification({message: message, type: 'success'})
        setTimeout(() => {
          navigate("/");
        }, 2000);
        // dispatch(orderProduct([]));
        // setSubTotal(0);
        // products.map(async(item) => {
        //   await cartAPI(item?.id, token, "DELETE", "");
        // })
        // dispatch(addToCart([]));
        SetIsLoading(false);
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
  const handleContinueShop = async () => {
    navigate('/')
  }
  return (
    <div>
      <Layout>
        <Sider
          width={700}
          style={{
            background: "#fff",
            padding: "20px",
            height: "100vh",
            boxShadow: "2px 0px 4px rgba(0, 21, 41, 0.08)",
          }}
        >
          <Header
            style={{
              padding: 0,
              background: "#fff",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 5,
                fontWeight: "bold",
              }}
            >
              Add address
            </div>
          </Header>
          <Form
            form={form}
            name="address-form"
            onFinish={handlePlaceOrder}
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              maxWidth: 600,
              marginLeft: "0px",
            }}
          >
            <Form.Item
              name="FirstName"
              label="First name"
              rules={[
                {
                  required: true,
                  message: "Please tell us your first name",
                },
              ]}
            >
              <Input placeholder="First name" />
            </Form.Item>
            <Form.Item
              name="LastName"
              label="Last name"
              rules={[
                {
                  required: true,
                  message: "Please tell us your last name",
                },
              ]}
            >
              <Input placeholder="Last name" />
            </Form.Item>
            <Form.Item
              name="Address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Please input your address",
                },
              ]}
            >
              <TextArea rows={3} placeholder="Address" />
            </Form.Item>
            <Form.Item
              name="State"
              label="State"
              rules={[
                {
                  required: true,
                  message: "Please select your state",
                },
              ]}
            >
              <Select>
                <Select.Option value="MP">Madhaya Pradesh</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="City"
              label="City"
              rules={[
                {
                  required: true,
                  message: "Please select your city",
                },
              ]}
            >
              <Select>
                <Select.Option value="Indore">Indore</Select.Option>
                <Select.Option value="Bhopal">Bhopal</Select.Option>
                <Select.Option value="Pune">Pune</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="PinCode"
              label="Pin code"
              rules={[
                {
                  required: true,
                  message: "Please input your pin code",
                },
              ]}
            >
              <InputNumber placeholder="Pin code" />
            </Form.Item>
            <Form.Item
              name="PhoneNumber"
              label="Phone number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number",
                },
              ]}
            >
              <InputNumber
                addonBefore="+91"
                placeholder="Phone number"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="PaymentMode"
              label="Payment method"
              rules={[
                {
                  required: true,
                  message: "Please select your payment method",
                },
              ]}
            >
              <Radio.Group>
                <Radio onClick={() => paymentMethod("UPI")} value="UPI">
                  UPI
                </Radio>
                <Radio onClick={() => paymentMethod("Card")} value="Card">
                  {" "}
                  Card{" "}
                </Radio>
                <Radio onClick={() => paymentMethod("")} value="COD">
                  {" "}
                  Cash on delivery{" "}
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item noStyle>
              {paymentMode?.UPI ? (
                <Form.Item
                  name="UPI"
                  label="UPI ID"
                  rules={[
                    {
                      required: true,
                      message: "Please insert your UPI address",
                    },
                  ]}
                >
                  <Input placeholder="abc@example" />
                </Form.Item>
              ) : paymentMode?.Card ? (
                <>
                  <Form.Item
                    name="NameOnCard"
                    label="Name on card"
                    rules={[
                      {
                        required: true,
                        message: "Please provide name on card",
                      },
                    ]}
                  >
                    <Input placeholder="Name on card" />
                  </Form.Item>
                  <Form.Item
                    name="CardNumber"
                    label="Card number"
                    rules={[
                      {
                        required: true,
                        message: "Please your card number",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="1111111111111111"
                    />
                  </Form.Item>
                  <Form.Item
                    name="expDate"
                    label="Expire on"
                    rules={[
                      {
                        required: true,
                        message: "Please choose expiring month and year",
                      },
                    ]}
                  >
                    <DatePicker
                      picker="month"
                      placeholder="month-year"
                      format={{ format: "MM-YY" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="cvv"
                    label="CVV"
                    rules={[
                      {
                        required: true,
                        message: "Please provide cvv",
                      },
                    ]}
                  >
                    <InputNumber placeholder="CVV" />
                  </Form.Item>
                </>
              ) : null}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ marginLeft: "125px", fontWeight: "bold" }}
              >
                Place order : {subTotal} ₹
              </Button>
            </Form.Item>
          </Form>
        </Sider>
        <Layout style={{ background: "#fff" }}>
          <Content
            style={{
              background: "#fff",
              margin: "10px 16px 0",
              overflow: "initial",
            }}
          >
            <div
              className="site-layout-background"
              style={{
                padding: 20,
                background: "rgba(255, 255, 255, 0.2)",
              }}
            >
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
              {products?.length
                ? products.map((cart, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #e8e8e8",
                        paddingBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          height: "120px",
                          width: "120px",
                          marginRight: "10px",
                        }}
                      >
                        <img
                          src={cart.image ?? cart?.productImage}
                          alt={cart.image ?? cart?.productImage}
                          key={cart.id}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        ></img>
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: "bold",
                            marginBottom: "5px",
                            marginTop: "10px",
                          }}
                        >
                          {cart.productName}
                        </p>
                        <p style={{ color: "gray", marginBottom: "5px" }}>
                          {truncateText(cart.description, 30)}
                        </p>
                        <p style={{ color: "gray", marginBottom: "5px" }}>
                          quantity: {cart.cartQuantity ?? cart?.quantity}
                        </p>
                        <p
                          style={{
                            fontWeight: "bold",
                            position: "relative",
                            top: 10,
                            marginLeft: "130px",
                          }}
                        >
                          {cart.totalPrice}₹
                        </p>
                        <div
                          style={{ position: "relative", marginTop: "-30px" }}
                        >
                          <Tooltip title="Add quantity" placement="bottom">
                            <Button
                              size="middle"
                              onClick={() => handleCart(cart?.cartQuantity ? cart?.id : cart?.productId, 1, "POST")}
                            >
                              +
                            </Button>
                          </Tooltip>
                          <Tooltip title="Remove quantity" placement="bottom">
                            <Button
                              style={{
                                marginLeft: "5px",
                                paddingLeft: "17px",
                                paddingRight: "17px",
                              }}
                              onClick={() => handleCart(cart?.cartQuantity ? cart?.id : cart?.productId, -1, "POST")}
                            >
                              -
                            </Button>
                          </Tooltip>
                          <Tooltip title="Remove product" placement="bottom">
                            <DeleteOutlined
                              style={{
                                marginLeft: "10px",
                                fontSize: "20px",
                                color: "red",
                              }}
                              onClick={() => handleCart(cart?.cartQuantity ? cart?.id : cart?.productId, 0, "DELETE")}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
                <Button type="primary" onClick={handleContinueShop} style={{position: 'relative', top: 10}} block>
                  Continue shopping
                </Button>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
