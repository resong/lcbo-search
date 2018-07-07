import React, { Component } from "react";

import { fetchLcboEndpoint } from "./api/lcbo.js";

import Map from "./components/map/Map";
import Product from "./components/product/Product";
import Container from "./components/product/Container";

// import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

// const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;

// const GOOGLE_API_URL = `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`;

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

  handleStoreFetch = () => {

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
