import { Modal } from "antd";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { notification } from "antd";
import { getEnv } from "../../config/config";
import axios from "axios";

function AddProduct({ visible, onCancel, product, setProduct }) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [formData, setFormData] = useState({});

  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  async function handleOk(e) {
    setConfirmLoading(true);
    const token = localStorage.getItem("token");
    e.preventDefault();
    try {
      const res = await axios.post(
        `${getEnv("REACT_APP_API_ENDPOINT")}/product/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, message, data } = res?.data;
      if (status) {
        setProduct([...product, data]);
        openNotification({ message: message, type: "success" });
        setFormData({
          productName: "",
          price: "",
          description: "",
          quantity: "",
        });
        document.getElementById('formFile').value = '';
        setTimeout(() => {
          onCancel();
          setConfirmLoading(false);
        }, 1000);
      }
    } catch (err) {
      const data = {
        message: err?.response?.data?.error ?? err?.response?.data?.message,
        type: "error",
      };
      openNotification(data);
    }
  }
  return (
    <>
      {contextHolder}
      <Modal
        title="Add new product"
        open={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
      >
        <Form onSubmit={handleOk}>
          <Form.Group controlId="productName">
            <Form.Label>Product name</Form.Label>
            <Form.Control
              type="productName"
              placeholder="Enter product name"
              value={formData.productName}
              name="productName"
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              name="price"
              value={formData.price}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Product description</Form.Label>
            <Form.Control
              type="description"
              placeholder="Enter product description"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter product quantity"
              name="quantity"
              value={formData.quantity}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
        </Form>
      </Modal>
    </>
  );
}
export default AddProduct;
