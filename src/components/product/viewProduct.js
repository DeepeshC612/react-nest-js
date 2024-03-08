import { Modal } from "antd";
import React from "react";

function ViewProduct({ visible, onCancel, product }) {
  return (
    <>
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
            <p style={{ marginTop:"10px" }}>Product Name: {product.productName}</p>
            <p>Product price: {product.price}₹</p>
            <p>Product description: {product.description}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
export default ViewProduct;
