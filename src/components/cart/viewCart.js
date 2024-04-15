import { Button, Modal, notification, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import { cartAPI } from "../../services/cartApi";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slice/auth/auth.slices";

function ViewCart({ cart, setCartList, setCartCount }) {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
    });
  };
  const handleCart = async (id, value) => {
    try {
      const payload = {
        productId: id,
        quantity: Number(value),
      };
      const res = await cartAPI("", token, "POST", payload);
      if (res) {
        if (typeof res === "string") {
          openNotification({ message: res, type: "error" });
        } else {
          dispatch(addToCart([...res]));
          setCartList([...res]);
          setCartCount(res?.length);
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
  };
  const removeCart = async (id) => {
    try {
      const res = await cartAPI(id, token, "DELETE", "");
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
  const handleCheckout = async () => {
    navigate("/checkout");
  };
  function truncateText(text, limit) {
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + "....";
  }
  const SubTotal = cart.reduce((acc, index) => {
    return +acc + +index?.totalPrice;
  }, 0);
  return (
    <>
      {contextHolder}
        {cart?.length === 0 ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "35%",
              fontSize: "22px",
            }}
          >
            Cart is empty...
          </div>
        ):
        <div style={{ overflowY: "auto", height: "calc(100vh - 100px)" }}>
          {cart.map((cart, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
                paddingBottom: "15px",
                borderBottom: "1px solid #e8e8e8",
              }}
            >
              <div
                style={{ height: "100px", width: "100px", marginRight: "10px" }}
              >
                <img
                  src={cart.productImage}
                  alt={cart.productImage}
                  key={cart.id}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "50px",
                    marginLeft: "15px",
                    marginTop: "5px",
                  }}
                ></img>
              </div>
              <div>
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: "2px",
                    marginTop: "10px",
                    marginLeft: "15px",
                  }}
                >
                  {cart.productName}
                </p>
                <p style={{ color: "gray", marginBottom: "5px", marginLeft: "15px", }}>
                  {truncateText(cart.description, 30)}
                </p>
                <p style={{ color: "gray", marginBottom: "5px", marginLeft: "15px", }}>
                  quantity: {cart.quantity}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    position: "relative",
                    marginLeft: "220px",
                    top: 10,
                  }}
                >
                  {cart.totalPrice}₹
                </p>
                <div style={{ position: "relative", marginTop: "-30px", marginLeft: "15px", }}>
                  <Tooltip title="Add quantity" placement="bottom">
                    <Button
                      size="middle"
                      onClick={() => handleCart(cart?.productId, 1)}
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
                      onClick={() => handleCart(cart?.productId, -1)}
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
                      onClick={() => removeCart(cart?.productId)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
          <div>
          <Button
            type="primary"
            key="checkout"
            onClick={handleCheckout}
            size="large"
            style={{ bottom: 10, marginLeft: '18px', width: "90%", marginTop: "10px" }}
            
          >
            Checkout: {SubTotal} ₹
          </Button>
          </div>
        </div>
        }
    </>
  );
}
export default ViewCart;
