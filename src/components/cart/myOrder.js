import { Layout, Table, notification } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getEnv } from "../../config/config";
import { useNavigate } from "react-router-dom";
import SideBar from "../common/sideBar";
import { Content, Header } from "antd/es/layout/layout";

function MyOrder() {
  const [api, contextHolder] = notification.useNotification();
  const [orderList, setOrderList] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
          if (data?.length) {
            let newData = data?.map((item, index) => {
              item.key = index + 1
              return item
            })
            console.log(newData);
            setOrderList(newData);
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

  let columns = [
    {
      title: "OrderId",
      dataIndex: "orderId",
      key: "orderId",
      fixed: "left",
      render: (text) => <p style={{margin: '10px'}}>#{text}</p>,
      width: 70,
    },
    {
      dataIndex: "image",
      key: "image",
      width: 65,
      render: (img) => (
        <img
          src={img}
          alt={img}
          style={{
            height: "50px",
            width: "50px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        ></img>
      ),
      fixed: "left",
    },
    {
      title: "Product name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <p>{text}</p>,
      fixed: "left",
      width: 100
    },
    {
      title: "Ordered Date",
      dataIndex: "orderedDate",
      key: "orderedDate",
      render: (text) => <p style={{color: 'Highlight'}}>{text.split("T")[0]}</p>,
    },
    {
      title: "Tracking status",
      dataIndex: "productNames",
      key: "productNames",
      render: () => <p style={{color: 'green'}}>Ready to ship</p>,
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
      render: (text) => <p>{text} ₹</p>
    },
    {
      title: "Order Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => <p style={{color: 'Highlight'}}>{text} ₹</p>
    },
  ];
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
            <p style={{ fontWeight: 'bold', marginLeft: "18px"}}>My Order list</p> 
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
            <Table
              columns={columns}
              dataSource={orderList}
              size="small"
              pagination={{
                pageSize: 50,
              }}
              scroll={{
                x: 900,
                y: 600,
              }}
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
export default MyOrder;
