import React, { Component } from "react";

import { fetchLcboEndpoint } from "./api/lcbo.js";

import Map from "./components/map/Map";
import Product from "./components/product/Product";
import Container from "./components/product/Container";

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      inventory: [],
      isLoading: false
    };
  }
  
  onSearchSubmit = (e) => {
    
    e.preventDefault();
    
    this.setState({ isLoading: true });
    
    fetchLcboEndpoint("products", {
      q: this.state.searchTerm
    }).then((data) => {
      
      const productList = 
        data.result.map((product) => 
        ({ 
          id: product.id, 
          name: product.name, 
          clicked: false 
        })
      );

      this.setState({
        inventory: productList,
        isLoading: false
      });

    });
  }

  onSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  fetchStores = (product) => {
    fetchLcboEndpoint("stores", {
      product_id: product.id
    }).then((data) => {

      const storeList = 
        data.result
          .filter((store) => !store.is_dead && store.inventory_count > 0)
          .map((store) => 
            ({
              id: store.id, 
              lat: store.latitude, 
              long: store.longitude 
            })
          );
      
      const productList = 
        this.state.inventory.map((prod) => 
          prod.id === product.id 
          ? { ...prod, clicked: !prod.clicked, stores: storeList }
          : prod
        );

      this.setState({ inventory: productList });
    });

  }

  render() {

    const { searchTerm, inventory, isLoading } = this.state;

    const renderList = () => inventory.map((item) => 
      <Container key={item.id}>
        <Product 
          onProductClick={this.fetchStores}
          product={item}/>
        <Map show={item.clicked} stores={item.stores} />
      </Container>
    );

    return (
      <div>
        <form onSubmit={this.onSearchSubmit}>
          <input 
            type="text"
            value={searchTerm}
            onChange={this.onSearchChange} />
          <button type="submit">Search</button>
        </form>
        { isLoading ? "Loading..." : renderList() }
      </div>
    
    );
  }
}

export default App;
