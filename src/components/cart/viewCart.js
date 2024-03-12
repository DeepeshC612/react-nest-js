import { Button, Modal, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import { cartAPI } from "../../services/cartApi";

function ViewCart({ visible, onCancel, cart, setCartList, setCartCount }) {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
      duration: 0,
    });
  };
  const handleCart = async (id, value) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        productId: id,
        quantity: Number(value),
      };
      const res = await cartAPI("", token, "POST", payload);
      if (res) {
        setCartList([...res]);
        setCartCount(res?.length);
      }
    } catch (err) {
      const data = {
        message: err?.response?.data?.error ?? err?.response?.data?.message,
        type: "error",
      };
      openNotification(data);
    }
  };
  const removeCart = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await cartAPI(id, token, "DELETE", "");
      if (res) {
        setCartList([...res]);
        setCartCount(res?.length);
      }
    } catch (err) {
      const data = {
        message: err?.response?.data?.error ?? err?.response?.data?.message,
        type: "error",
      };
      openNotification(data);
    }
  };
  const SubTotal = cart.reduce((acc, index) => {
    return +acc + +index?.totalPrice;
  }, 0);
  return (
    <>
      {contextHolder}
      <Modal
        title="Shopping Cart"
        open={visible}
        footer={[
          <div>
            <Button type="primary" key={cart?.id} style={{bottom: '10px'}} block>
              Checkout: {SubTotal} ₹
            </Button>
          </div>,
        ]}
        width={500}
        onCancel={onCancel}
        style={{
          position: "fixed",
          overflow: "hidden",
          height: "100vh",
          top: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {cart?.length === 0 && (
          <div style={{position: 'absolute', top: '50%', left: '35%', fontSize: '22px'}}>Cart is empty...</div>
        )}
        <div style={{ overflowY: "auto", height: "calc(100vh - 100px)" }}>
          {cart.map((cart, index) => (
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
                style={{ height: "120px", width: "120px", marginRight: "10px" }}
              >
                <img
                  src={cart.productImage}
                  alt={cart.productImage}
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
                  {cart.description}
                </p>
                <p style={{ color: "gray", marginBottom: "5px" }}>
                  quantity: {cart.quantity}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    position: "relative",
                    marginLeft: "250px",
                  }}
                >
                  {cart.totalPrice}₹
                </p>
                <div style={{ position: "relative", marginTop: "-30px" }}>
                  <Button
                    size="middle"
                    onClick={() => handleCart(cart?.productId, 1)}
                  >
                    +
                  </Button>
                  <Button
                    style={{
                      marginLeft: "5px",
                      paddingLeft: "17px",
                      paddingRight: "17px",
                    }}
                    onClick={() => handleCart(cart?.productId, -1)}
                  >
                    -
                  </Button>
                  <DeleteOutlined
                    style={{ marginLeft: "10px", fontSize: "20px" }} onClick={()=> removeCart(cart?.productId)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
export default ViewCart;
