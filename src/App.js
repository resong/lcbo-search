import React, { Component } from "react";

import { fetchLcboEndpoint } from "./api/lcbo.js";

import Map from "./components/map/Map";
import Product from "./components/product/Product";
import Container from "./components/Container";

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      inventory: [],
      storesToDisplay: [],
      isLoading: false,
      errorMsg: ""
    };
  }
  
  onSearchSubmit = (e) => {
    
    const { searchTerm } = this.state;

    e.preventDefault();

    if (searchTerm.length === 0) {
      this.setState({ errorMsg: "Please enter a keyword to search for booze." });
      return;
    }
    
    this.setState({ 
      isLoading: true, 
      inventory: [], 
      storesToDisplay: [] 
    });
    
    fetchLcboEndpoint("products", {
      q: searchTerm
    }).then((data) => {
      
      if (data.result.length === 0) {
        this.setState({ errorMsg: "Oops! There are no products with that keyword. Are you sure you haven't had too much to drink already?" });
        return;
      }

      const productList = 
        data.result.map((product) => 
        ({ 
          id: product.id, 
          name: product.name
        })
      );

      this.setState({
        inventory: productList,
        isLoading: false
      });

    }).catch((err) => 
      this.setState({ errorMsg: "Oops! The ship with all the booze has crashed x_x" })
    );
  }

  onSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  fetchStores = (product) => {

    if (product.stores && product.stores.length > 0) {
      this.setState({ storesToDisplay: product.stores });
      return;
    }

    fetchLcboEndpoint("stores", {
      product_id: product.id
    }).then((data) => {

      const storeList = 
        data.result
          .filter((store) => !store.is_dead && store.inventory_count > 0)
          .map((store) => 
            ({
              id: store.id, 
              name: store.name,
              lat: store.latitude, 
              long: store.longitude 
            })
          );
      
      const productList = 
        this.state.inventory.map((prod) => 
          prod.id === product.id 
          ? { ...prod, stores: storeList }
          : prod
        );

      this.setState({ 
        inventory: productList, 
        storesToDisplay: storeList 
      });

    }).catch((err) => 
      this.setState({ errorMsg: "Something's gone wrong... Bandits are pillaging the stores!" })
    );

  }
  
  render() {

    const { 
      searchTerm, 
      inventory, 
      storesToDisplay, 
      isLoading, 
      errorMsg 
    } = this.state;

    const renderList = () => inventory.map((store) => 
      <Container key={store.id}>
        <Product 
          onProductClick={this.fetchStores}
          product={store}/>
      </Container>
    );

    return (
      <div>
        <h1>Quench It!</h1>
        <form onSubmit={this.onSearchSubmit}>
          <input 
            type="text"
            value={searchTerm}
            onChange={this.onSearchChange} />
          <button type="submit">Search</button>
        </form>
        { 
          errorMsg.length > 0 
          ? errorMsg 
          : isLoading 
            ? "Loading..." 
            : renderList() 
        }
        <Map stores={storesToDisplay} />
      </div>
    
    );
  }
}

export default App;
