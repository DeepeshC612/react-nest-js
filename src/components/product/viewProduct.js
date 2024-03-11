import { Button, Modal, notification } from "antd";
import React from "react";
import { cartAPI } from "../../services/cartApi";

function ViewProduct({ visible, onCancel, product, cartCount, setCartCount }) {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
      duration: 0,
    });
  };
  const handleCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        productId: product?.id,
        quantity: 1,
      };
      const res = await cartAPI("", token, "POST", payload);
      if (res) {
        let count = +cartCount + 1
        localStorage.setItem("cartCount", count);
        setCartCount(localStorage.getItem("cartCount"));
      }
    } catch (err) {
      const data = {
        message: err?.response?.data?.error ?? err?.response?.data?.message,
        type: "error",
      };
      openNotification(data);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Product details"
        open={visible}
        footer={[]}
        onCancel={onCancel}
      >
        {product && (
          <div>
            <img
              src={product.image}
              alt={product.image}
              key={product.id}
              style={{ height: "200px", objectFit: "cover" }}
            ></img>
            <p style={{ marginTop: "10px" }}>
              Product Name: {product.productName}
            </p>
            <p>Product price: {product.price}₹</p>
            <p>Product description: {product.description}</p>
            <div style={{ marginTop: "10px" }}>
              <Button type="primary" block onClick={handleCartCount}>
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
export default ViewProduct;
