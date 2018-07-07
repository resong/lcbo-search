import React from "react";

const Product = ({ onProductClick, product }) => {
 
  const handleClick = () => {
    onProductClick(product);
  }

  return (
    <div onClick={handleClick}>
        { product.name }
    </div>
  )
};

export default Product;