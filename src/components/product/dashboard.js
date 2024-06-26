import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../../config/config";
import axios from "axios";
import { productAPI } from "../../services/productApi";
import DeleteProduct from "./deleteProduct";
import AddProduct from "./addProduct";
import ViewProduct from "./viewProduct";
import ViewCart from "../cart/viewCart";
import {
  LoadingOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  ShoppingOutlined,
  ShoppingFilled,
} from "@ant-design/icons";
import {
  notification,
  Spin,
  Layout,
  Card,
  Col,
  Row,
  Avatar,
  Tooltip,
} from "antd";
import EditProduct from "./editProduct";
import { cartAPI } from "../../services/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../slice/auth/auth.slices";
import SideBar from "../common/sideBar";
import Headers from "../common/header";

const { Content, Sider } = Layout;
const { Meta } = Card;

export default function Dashboard() {
  const userData = useSelector((state) => state?.auth?.userData);
  const [product, setProduct] = useState({});
  const [catList, setCartList] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, SetIsLoading] = useState(false);
  const [viewCartModal, setViewCartModal] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [viewProductModal, setViewProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    SetIsLoading(true);
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
          setProducts(data);
          if (userData?.role !== "admin") {
            let cart = await cartAPI("", token, "GET", "");
            if (cart) {
              setCartList(cart);
              dispatch(addToCart(cart));
              cart?.map((e) => {
                handleIsClicked(e?.productId);
                return e;
              });
            }
            setCartCount(cart?.length);
          }
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

  const showAddProduct = (data) => {
    setAddProductModal(data);
  };

  const showViewProduct = async (data, id) => {
    try {
      if (id) {
        const res = await productAPI(id, token, "GET", "");
        if (res) {
          setProduct(res);
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
    setViewProductModal(data);
  };

  const showCart = async (data) => {
    setViewCartModal(data);
    document.body.style.overflowX = "hidden";
  };

  const showEditProduct = async (data, e) => {
    if (e) {
      setProduct(e);
    }
    setEditProductModal(data);
  };

  const showDeleteProduct = async (data, id) => {
    if (id) {
      setProduct(id);
    }
    setDeleteProductModal(data);
  };

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

  const checkBagClicked = (id) => {
    let data = false;
    catList?.map((e) => {
      if (e?.productId === id) {
        data = true;
      }
      return true;
    });
    return data;
  };

  function handleIsClicked(id, value) {
    const findProduct = products.find((e) => e.id === id);
    if (findProduct) {
      findProduct["isClicked"] = value;
    }
  }

  const handleIconClick = async (id, method) => {
    try {
      const payload = {
        productId: id,
        quantity: 1,
      };
      let res;
      if (method === "add") {
        res = await cartAPI("", token, "POST", payload);
        handleIsClicked(id, true);
      } else {
        res = await cartAPI(id, token, "DELETE", "");
        handleIsClicked(id, false);
      }
      if (res) {
        setCartList([...res]);
        dispatch(addToCart([...res]));
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

  function truncateText(text, limit) {
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + "....";
  }

  return (
    <div>
      <Layout>
        <SideBar />
        <Layout
          className="site-layout"
          style={{
            marginLeft: 200,
          }}
        >
          <Headers
            cartCount={cartCount}
            setViewCartModal={setViewCartModal}
            setAddProductModal={setAddProductModal}
            viewCartModal={viewCartModal}
          />
          <Layout>
            <Content
              onClick={() => showCart(false)}
              style={{
                margin: "10px 16px 0",
                overflow: "initial",
                height: "100vh",
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
                <Row gutter={[16, 16]}>
                  {products.map((e, index) => (
                    <div key={index} style={{ marginTop: "15px" }}>
                      <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Card
                          bordered={false}
                          style={{
                            width: 200,
                            marginInline: "10px",
                            height: 350,
                            boxShadow: "0 0px 5px 0px rgba(0,0,0,0.3)",
                          }}
                          cover={
                            <img
                              alt={e.image}
                              src={e.image}
                              key={index}
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          }
                          actions={
                            userData?.role !== "admin"
                              ? [
                                  <Tooltip title="View product">
                                    <EyeOutlined
                                      key="view"
                                      style={{ fontSize: "18px" }}
                                      onClick={() =>
                                        showViewProduct(true, e?.id)
                                      }
                                    />
                                  </Tooltip>,
                                  <Tooltip title="Edit product">
                                    <EditOutlined
                                      key="edit"
                                      style={{ fontSize: "18px" }}
                                      onClick={() => {
                                        showEditProduct(true, e);
                                      }}
                                    />
                                  </Tooltip>,
                                  <div style={{ marginTop: "3px" }}>
                                    {checkBagClicked(e?.id) ? (
                                      <Tooltip title="Remove from Cart">
                                        <ShoppingFilled
                                          key="cartRemove"
                                          style={{ fontSize: "20px" }}
                                          onClick={() =>
                                            handleIconClick(e?.id, "")
                                          }
                                        />
                                      </Tooltip>
                                    ) : (
                                      <Tooltip title="Add to Cart">
                                        <ShoppingOutlined
                                          key="cartAdd"
                                          style={{ fontSize: "20px" }}
                                          onClick={() =>
                                            handleIconClick(e?.id, "add")
                                          }
                                        />
                                      </Tooltip>
                                    )}
                                  </div>,
                                  <Tooltip title="Delete product">
                                    <DeleteOutlined
                                      key="deleted"
                                      style={{ fontSize: "18px" }}
                                      onClick={() =>
                                        showDeleteProduct(true, e?.id)
                                      }
                                    />
                                  </Tooltip>,
                                ]
                              : [
                                  <Tooltip title="View product">
                                    <EyeOutlined
                                      key="view"
                                      style={{ fontSize: "18px" }}
                                      onClick={() =>
                                        showViewProduct(true, e?.id)
                                      }
                                    />
                                  </Tooltip>,
                                  <Tooltip title="Edit product">
                                    <EditOutlined
                                      key="edit"
                                      style={{ fontSize: "18px" }}
                                      onClick={() => {
                                        showEditProduct(true, e);
                                      }}
                                    />
                                  </Tooltip>,
                                  <Tooltip title="Delete product">
                                    <DeleteOutlined
                                      key="deleted"
                                      style={{ fontSize: "18px" }}
                                      onClick={() =>
                                        showDeleteProduct(true, e?.id)
                                      }
                                    />
                                  </Tooltip>,
                                ]
                          }
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
                            description={
                              <div
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {truncateText(e.description, 15)}
                              </div>
                            }
                          />
                        </Card>
                      </Col>
                    </div>
                  ))}
                </Row>
              </div>
            </Content>

            <Sider
              width="30%"
              collapsible
              collapsed={!viewCartModal}
              collapsedWidth={0}
              style={{
                height: "105vh",
                background: "#fff",
                boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.4)",
                overflowX: "hidden",
              }}
            >
              <ViewCart
                cart={catList}
                setCartList={setCartList}
                setCartCount={setCartCount}
              />
            </Sider>
          </Layout>
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
            setCartCount={setCartCount}
            setCartList={setCartList}
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
