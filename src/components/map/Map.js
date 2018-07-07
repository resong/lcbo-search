import React, { Fragment } from "react";
import StoreMap from "./StoreMap";

const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;
const GOOGLE_API_URL = `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`;

const Map = ({ show, stores }) => (
    show
    ? <StoreMap
    list={stores}
    googleMapURL={GOOGLE_API_URL}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px` }} />}
    mapElement={<div style={{ height: `100%` }} />}
    />       
  : <Fragment></Fragment>
);

export default Map;