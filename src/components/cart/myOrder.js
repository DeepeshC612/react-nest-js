import { Button, Layout, Modal, Table, notification } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getEnv } from "../../config/config";
import { cartAPI } from "../../services/cartApi";
import { addToCart } from "../../slice/auth/auth.slices";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "../common/sideBar";
import Headers from "../common/header";
import { Content, Header } from "antd/es/layout/layout";

function MyOrder({ visible, onCancel, product, setCartCount, setCartList }) {
  const [api, contextHolder] = notification.useNotification();
  const [orderList, setOrderList] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
    });
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
            if(data?.length) {
                let newData = data.map((item, index) => {
                    item.key = index + 1
                    return item
                })
                setOrderList(data)
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
  const handleCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        productId: product?.id,
        quantity: 1,
      };
      const res = await cartAPI("", token, "POST", payload);
      if (res) {
        dispatch(addToCart([...res]));
        setCartList([...res]);
        setCartCount(res?.length);
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
  };
  let columns = [
    {
      title: "Order Id",
      dataIndex: "orderId",
      key: "orderId"
    },
    {
      title: "Product Image",
      dataIndex: "image",
      key: "image",
      render: (img) => <img src={img} style={{ height: "50px", width:"50px", objectFit: "cover", borderRadius: '50%' }}></img>,
    },
    {
      title: "Product name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ordered Date",
      dataIndex: "orderedDate",
      key: "orderedDate",
      render: (text) => <a>{text.split("T")[0]}</a>,
    },
    {
      title: "Tracking status",
      dataIndex: "productNames",
      key: "productNames",
      render: (text) => <a>Into the shipment</a>,
    },
    {
      title: "Product quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Product price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Order Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
    //   render: (text) => <a>{text}</a>,
    },
  ];
  return (
    <>
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
          />
          <Content
            style={{
              margin: "10px 16px 0",
              overflow: "initial",
              height: "100vh",
              padding: 20,
              background: "#fff",
            }}
          >
            <Table columns={columns} dataSource={orderList}/>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
export default MyOrder;
