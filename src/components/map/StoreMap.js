import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import StoreMarkers from "./StoreMarkers";

// defaultCenter={{lat: list[0].lat, lng: list[0].long}}
const CANADA = { lat: 43.65, lng: -79.38 };

const StoreMap = withScriptjs(withGoogleMap(({ list }) =>
    <GoogleMap
      defaultZoom={7}
      defaultCenter={CANADA}
    >
        <StoreMarkers list={list} />
    </GoogleMap>
));

export default StoreMap;