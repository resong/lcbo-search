import React from "react";

import "./Product.css";

const Product = ({ onProductClick, product }) => {
 
  const handleClick = () => {
    onProductClick(product);
  }

  return (
    <a onClick={handleClick}>
        { product.name }
    </a>
  )
};

export default Product;