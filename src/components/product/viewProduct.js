import { Button, Modal, notification } from "antd";
import React from "react";
import { cartAPI } from "../../services/cartApi";
import { addToCart } from "../../slice/auth/auth.slices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ViewProduct({
  visible,
  onCancel,
  product,
  setCartCount,
  setCartList,
}) {
  const [api, contextHolder] = notification.useNotification();
  const userData = useSelector((state) => state?.auth?.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
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
            <p style={{ marginTop: "10px", fontFamily: "monospace" }}>
              Product Name: {product.productName}
            </p>
            <p style={{fontFamily: "monospace"}}>Product price: {product.price}₹</p>
            <p style={{fontFamily: "monospace"}}>Product description: {product.description}</p>

            {userData?.role !== "admin" ? (
              <div style={{ marginTop: "10px" }}>
                <Button type="primary" block onClick={handleCartCount}>
                  Add to Cart
                </Button>
              </div>
            ) : (
              <>
                <p><span style={{fontWeight: "bold"}}>Seller Name :</span> {product.userName}</p>
                <p><span style={{fontWeight: "bold"}}>Seller Email :</span> {product.userEmail}</p>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
export default ViewProduct;
