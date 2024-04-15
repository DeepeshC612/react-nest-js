import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { notification } from "antd";
import { productAPI } from "../../services/productApi";
import { useNavigate } from "react-router-dom";

function EditProduct({
  visible,
  onCancel,
  clickedProduct,
  product,
  setProduct,
}) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    description: "",
    quantity: "",
  });
  useEffect(() => {
    setFormData({
      productName: clickedProduct.productName,
      price: clickedProduct.price,
      description: clickedProduct.description,
      quantity: clickedProduct.quantity,
    });
}, [clickedProduct]);

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

  async function handleOk(e, id) {
    setConfirmLoading(true);
    const token = localStorage.getItem("token");
    e.preventDefault();
    try {
      const res = await productAPI(id, token, "PUT", formData);
      if (res) {
        let index = product.findIndex((item) => item.id === id);
        product[index] = res?.data;
        setProduct([...product]);
        openNotification({ message: res?.message, type: "success" });
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
      if (data.message === "Unauthorized") {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
      openNotification(data);
    }
  }
  return (
    <>
      {contextHolder}
      <Modal
        title="Edit product"
        open={visible}
        onOk={(e) => handleOk(e, clickedProduct?.id)}
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
          <img src={clickedProduct?.image} alt={clickedProduct?.image} style={{ objectFit:'contain', height: "150px", width: "150px", marginTop: '7px' }}></img>
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
export default EditProduct;
