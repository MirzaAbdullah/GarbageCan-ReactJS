import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MarkerMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={18}
      defaultCenter={{ lat: props.latitude, lng: props.longitude }}
    >
      {props.isMarkerShown && (
        <Marker position={{ lat: props.latitude, lng: props.longitude }} />
      )}
    </GoogleMap>
  ))
);

export default MarkerMap;
