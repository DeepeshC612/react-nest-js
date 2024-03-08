import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../../config/config";
import axios from "axios";
import { productAPI } from "../../services/productApi";
import DeleteProduct from "./deleteProduct";
import AddProduct from "./addProduct";
import ViewProduct from "./viewProduct";
import {
  LoadingOutlined,
  DropboxOutlined,
  LogoutOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import {
  notification,
  Spin,
  Layout,
  Menu,
  Card,
  Col,
  Row,
  Button,
  Avatar,
} from "antd";
import EditProduct from "./editProduct";

const { Header, Content, Sider } = Layout;
const { Meta } = Card;
const sideBarItems = [DropboxOutlined, LogoutOutlined].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: index === 0 ? "Product" : "Logout",
}));

export default function Dashboard() {
  const [isLoading, SetIsLoading] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [viewProductModal, setViewProductModal] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    SetIsLoading(true);
    const token = localStorage.getItem("token");
    async function fetchData() {
      try {
        const res = await axios.get(
          `${getEnv("REACT_APP_API_ENDPOINT")}/product`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { status, data } = res?.data;
        if (status) {
          SetIsLoading(false);
          setProducts(data);
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

  const showAddProduct = (data) => {
    setAddProductModal(data);
  };

  const showViewProduct = async (data, id) => {
    try {
      if (id) {
        const token = localStorage.getItem("token");
        const res = await productAPI(id, token, "GET", '');
        if (res) {
          setProduct(res);
        }
      }
    } catch (err) {
      const data = {
        message: err?.response?.data?.error ?? err?.response?.data?.message,
        type: "error",
      };
      openNotification(data);
    }
    setViewProductModal(data);
  };

  const showEditProduct = async (data, e) => {
    if(e) {
      setProduct(e)
    }
    setEditProductModal(data)
  }

  const showDeleteProduct = async (data, id) => {
    if (id) {
      setProduct(id)
    }
    setDeleteProductModal(data)
  }

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

  return (
    <div>
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div
            className="logo"
            style={{
              height: "32px",
              margin: "16px",
              background: "rgba(255, 255, 255, 0.2)",
            }}
          />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["4"]}
            items={sideBarItems}
          />
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: 200,
          }}
        >
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
              background: "#fff",
            }}
          >
            <Button
              style={{ position: "absolute", top: 15, right: 10 }}
              type="primary"
              onClick={() => showAddProduct(true)}
            >
              Add product
            </Button>
          </Header>
          <Content
            style={{
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
              <Row>
                {products.map((e, index) => (
                  <div key={e?.id} style={{ marginTop: "15px" }}>
                    <Col span={8}>
                      <Card
                        bordered={false}
                        style={{
                          width: 200,
                          marginInline: "10px",
                          height: 350,
                        }}
                        cover={
                          <img
                            alt={e.image}
                            src={e.image}
                            key={index}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        }
                        actions={[
                          <EyeOutlined
                            key="view"
                            onClick={() => showViewProduct(true, e?.id)}
                          />,
                          <EditOutlined key="edit" onClick={() => {showEditProduct(true, e)}}/>,
                          <DeleteOutlined key="delete" onClick={() => showDeleteProduct(true, e?.id)} />,
                        ]}
                      >
                        <Meta
                          avatar={
                            <Avatar
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginTop: "5px",
                                backgroundColor: "gray",
                              }}
                            >
                              {e.price}₹
                            </Avatar>
                          }
                          title={e.productName}
                          description={e.description}
                        />
                      </Card>
                    </Col>
                  </div>
                ))}
              </Row>
            </div>
          </Content>
          <AddProduct
            visible={addProductModal}
            onCancel={() => showAddProduct(false)}
            product={products}
            setProduct={setProducts}
          />
          <ViewProduct
            visible={viewProductModal}
            onCancel={() => showViewProduct(false, null)}
            product={product}
          />
          <DeleteProduct
            visible={deleteProductModal}
            onCancel={() => showDeleteProduct(false, null)}
            id={product}
            product={products}
            setProduct={setProducts}
          />
          <EditProduct
            visible={editProductModal}
            onCancel={() => showEditProduct(false, null)}
            clickedProduct={product}
            product={products}
            setProduct={setProducts}
          />
        </Layout>
      </Layout>
    </div>
  );
}
