import React from "react";
import Container from "./Container";
import Product from "./Product";
import Map from "../map/Map";

const ProductList = ({ products, fetch }) => {

    return products.map((item) => 
      <Container key={item.id}>
        <Product 
          onClick={fetch}
          product={item}>
        </Product>
        <Map show={item.clicked} stores={item.stores} />
      </Container>
    );

};

export default ProductList;