import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Button, Layout } from "antd";
const { Header } = Layout;

const Headers = ({
  cartCount,
  setViewCartModal,
  setAddProductModal,
  viewCartModal,
}) => {
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
        <div style={{ position: "absolute", right: 140, marginTop: "2px" }}>
          <Badge count={cartCount}>
            <ShoppingCartOutlined
              key="cart"
              style={{ fontSize: "28px" }}
              onClick={() => (viewCartModal ? showCart(false) : showCart(true))}
            />
          </Badge>
        </div>
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
