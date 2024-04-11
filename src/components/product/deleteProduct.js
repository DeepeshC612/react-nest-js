import { Button, Modal, notification } from "antd";
import React from "react";
import { productAPI } from "../../services/productApi";

function DeleteProduct({ visible, onCancel, id, product, setProduct }) {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
    });
  };

  const handleOk = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await productAPI(id, token, "DELETE", '');
      if (res) {
        let newProduct = product.filter(item => item.id !== id);
        setProduct([...newProduct])
        onCancel();
        openNotification({ message: res, type: "success" });
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
        title="Confirm deletion"
        open={visible}
        footer={[
          <div key={id}>
            <Button
              type="primary"
              danger
              key={product[0]?.id}
              style={{ marginRight: "5px" }}
              onClick={() => handleOk(id)}
            >
              Ok
            </Button>
            <Button type="primary" key={product[0]?.productName} onClick={onCancel}>
              Cancel
            </Button>
          </div>,
        ]}
        onCancel={onCancel}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </>
  );
}
export default DeleteProduct;
