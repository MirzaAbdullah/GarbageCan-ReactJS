import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow, GoogleMapReact  } from 'google-maps-react';
//Services
import {
  getAllPickupsByUserId,
  createPickupRequest,
} from "../../services/pickupService";
import authService from "../../services/authService";
import { GetAllItems, GetUserDetailsById } from "../../services/utilityService";

const mapStyles = {
  width: '100%',
  height: '100%',
  height: '400px'
};

export class Mapp extends Component {
  state = {
    showingInfoWindow: false,  // Hides or shows the InfoWindow
    activeMarker: {},          // Shows the active marker upon click
    selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
  };
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

 
  
  render() {
     

    

/*     const places = [
      {latitude: 25.8103146,longitude: -80.1751609},
      {latitude: 27.9947147,longitude: -82.5943645},
      {latitude: 28.4813018,longitude: -81.4387899},
      //...
    ]

    function MapDirectionsRenderer(props) {
      const [directions, setDirections] = useState(null);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const { places, travelMode } = props;
    
        const waypoints = places.map(p => ({
          location: { lat: p.latitude, lng: p.longitude },
          stopover: true
        }));
        const origin = waypoints.shift().location;
        const destination = waypoints.pop().location;
    
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: travelMode,
            waypoints: waypoints
          },
          (result, status) => {
            console.log(result)
            if (status === google.maps.DirectionsStatus.OK) {
              setDirections(result);
            } else {
              setError(result);
            }
          }
        );
      }); */
    
    /*   if (error) {
        return <h1>{error}</h1>;
      }
      return (
        directions && (
          <DirectionsRenderer directions={directions} />
        )
      );
    } */
 /*    task1 = new google.maps.Marker(position={
      lat: 24.90,
      lng: 67
    }) */
    return (
      <div>
        <Map
        google={this.props.google}
        zoom={15}
        style={mapStyles}
        //0 milestone of Karachi at the moment
        initialCenter={
          {
            lat: 24.860966,
            lng: 66.990501
          }
        }
      >
        <Marker id="GarbageCan HQ"
          onClick={this.onMarkerClick}
          name={'GarbageCan'}
          
        />

        <Marker id="task1"
        onClick={this.onMarkerClick}
        name={'Next delivery'}
        position={
          {
            lat: 24.9,
            lng: 67
          }
          
        }

        
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBrlxtaxUkUNZHr0L2fDpyG51rziyu5xu8'
})(Mapp);