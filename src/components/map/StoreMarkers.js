import React, { Fragment } from "react";
import { Marker } from "react-google-maps";

const StoreMarkers = ({ list }) => (
    
    <Fragment>
        {
            list.map((store) => 
            <Marker key={store.id} position={{lat: store.lat, lng: store.long}} />
            )
        }
    </Fragment>
);

export default StoreMarkers;
