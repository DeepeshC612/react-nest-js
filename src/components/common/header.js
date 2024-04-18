import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Button, Layout } from "antd";
import { useSelector } from "react-redux";
const { Header } = Layout;

const Headers = ({
  cartCount,
  setViewCartModal,
  setAddProductModal,
  viewCartModal,
}) => {
  const userData = useSelector((state) => state?.auth?.userData);
  const showCart = async (data) => {
    setViewCartModal(data);
    document.body.style.overflowX = "hidden";
  };
  const showAddProduct = (data) => {
    setAddProductModal(data);
  };
  return (
    <Layout>
      <Header
        style={{
          padding: 0,
          background: "#fff",
        }}
      >
        {userData?.role === "user" ? (
          <div style={{ position: "absolute", right: 140, marginTop: "2px" }}>
            <Badge count={cartCount}>
              <ShoppingCartOutlined
                key="cart"
                style={{ fontSize: "28px" }}
                onClick={() =>
                  viewCartModal ? showCart(false) : showCart(true)
                }
              />
            </Badge>
          </div>
        ) : null}

        <Button
          style={{ position: "absolute", top: 15, right: 10 }}
          type="primary"
          onClick={() => showAddProduct(true)}
        >
          Add product
        </Button>
      </Header>
    </Layout>
  );
};
export default Headers;
