import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import StoreMarkers from "./StoreMarkers";

const StoreMap = withScriptjs(withGoogleMap(({ list }) =>
    <GoogleMap
    defaultZoom={8}
    defaultCenter={{lat: list[0].lat, lng: list[0].long}}
    >
        <StoreMarkers list={list} />
    </GoogleMap>
));

export default StoreMap;