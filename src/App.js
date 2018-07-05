import React, { Component } from "react";

import { fetchLcboEndpoint } from "./api/lcbo.js";

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      inventory: [],
      isLoading: true
    };
  }
  
  componentDidMount() {
    // example of making an API request to the LCBO API
    // fetchLcboEndpoint("products", {
    //   q: "radler"
    // }).then(data => {
    //   this.setState({
    //     isLoading: false,
    //     products: data.result
    //   });
    // });
  }

  render() {

    const { searchTerm, inventory, isLoading } = this.state;

    const onSearchSubmit = (e) => {
      
      e.preventDefault();
      
      this.setState({ isLoading: true });
      
      fetchLcboEndpoint("products", {
        q: searchTerm
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

    const onSearchChange = (e) => {
      this.setState({ searchTerm: e.target.value });
    }

    const fetchStores = (product) => {
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
          inventory.map((prod) => 
            prod.id === product.id 
            ? { ...prod, clicked: !prod.clicked, stores: storeList }
            : prod
          );

        this.setState({ inventory: productList });
      });

    }

    const Map = ({ show, list }) => (
      show 
      ? <MyMapComponent 
        list={list}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        />       
      : <div></div>
    )
    
    const MyMapComponent = withScriptjs(withGoogleMap(({ list }) =>
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: list[0].lat, lng: list[0].long}}
      >
          <div>
            {
              list.map((store) => 
                <Marker key={store.id} position={{lat: store.lat, lng: store.long}} />
              )
            }
          </div>
      </GoogleMap>
  ));

    const renderList = () => inventory.map((item) => 
      <div key={item.id}>
        <div 
          onClick={() => fetchStores(item)}>
          { item.name }
        </div>
        <Map show={item.clicked} list={item.stores} />
      </div>
    );

    return (
      <div>
        <form onSubmit={onSearchSubmit}>
          <input 
            type="text"
            value={searchTerm}
            onChange={onSearchChange} />
          <button type="submit">Search</button>
        </form>
        { isLoading ? "Loading..." : renderList() }
      </div>
    
    );
  }
}

export default App;
