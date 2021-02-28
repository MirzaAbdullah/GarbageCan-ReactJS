import React, { Component } from "react";
import { toast } from "react-toastify";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";

//Components
import BannerAcceptPickup from "./common/BannerAcceptPickup";
import BannerDetailedPickup from "./common/BannerDetailedPickup";

//Services
import {
  getPickupRequestById,
  updatePickupStatus,
  updateRequestDetailsByDriver,
} from "../services/pickupService";
import { GetUserDetailsById } from "../services/utilityService";
import { getCurrentUser } from "../services/authService";
import { getAllAssignPickupsByDriverId } from "../services/assignService";

const mapStyles = {
  width: "100%",
  height: "400px",
};

class DeliverPickups extends Component {
  state = {
    requestDetail: {},
    userDetail: {},
    allAssignedJobs: [],
    isRequestAssignedToDriver: false,
    isRequestOutForPickup: false,
    currentUser: getCurrentUser(),
    showingInfoWindow: false, // Hides or shows the InfoWindow
    activeMarker: {}, // Shows the active marker upon click
    selectedPlace: {}, // Shows the InfoWindow to the selected place upon a marker
    selectedLocation: {},
  };

  async componentDidMount() {
    await this.GetAllPickupByDriver();
  }

  GetAllPickupByDriver = async () => {
    const { currentUser } = this.state;
    const { data: allAssinged } = await getAllAssignPickupsByDriverId(
      currentUser.userId
    );

    let allJobs = [];
    allAssinged.forEach((element) => {
      allJobs.push({
        idRequest: element.idRequest,
        address: this.handleRequestAddress(
          element.request.userData.userDetails
        ),
        latitudes: element.request.latitudes,
        longitudes: element.request.longitudes,
      });
    });

    this.setState({ allAssignedJobs: allJobs });
  };

  handleRequestAddress = (addressArray) => {
    let fullAddress = "";
    addressArray.forEach((element) => {
      fullAddress = `${element.address1}, ${element.address2}, ${element.city}, ${element.province}, ${element.country}`;
    });

    return fullAddress;
  };

  handleAcceptPickup = async (idRequest) => {
    //Update the status
    const { data: isStatusUpdated } = await updatePickupStatus(
      idRequest,
      "OutForPickup"
    );

    //If status is updated refresh the state
    if (isStatusUpdated) {
      this.handleRequestDetails(idRequest);

      toast.success(
        "You have accepted the pickup. After completing it please press completed button"
      );
    } else {
      toast.success("Accepting pickup request failed! Please try again");
    }
  };

  handleUpdatePickupCosts = async (idRequest, pickupCost, requestDetails) => {
    //Update the record
    const { data: isRecordUpdated } = await updateRequestDetailsByDriver(
      idRequest,
      parseFloat(pickupCost),
      requestDetails
    );

    //If status is updated refresh the state
    if (isRecordUpdated) {
      this.handleRequestDetails(idRequest);

      toast.success("Package picked up successfully.");
    } else {
      toast.error("Picking up package failed! Please try again.");
    }
  };

  handleRequestDetails = async (requestId) => {
    const { data: requestDetail } = await getPickupRequestById(requestId);
    const { data: userDetail } = await GetUserDetailsById(requestDetail.idUser);

    //Decide if request is outforPickup or assignedToDriver
    if (
      requestDetail.pickupStatus === "AssignedToDriver" ||
      requestDetail.pickupStatus === "Completed"
    ) {
      this.setState({
        isRequestAssignedToDriver: true,
        isRequestOutForPickup: false,
      });
    } else if (requestDetail.pickupStatus === "OutForPickup") {
      this.setState({
        isRequestAssignedToDriver: false,
        isRequestOutForPickup: true,
      });
    } else {
      this.setState({
        isRequestAssignedToDriver: false,
        isRequestOutForPickup: false,
      });
    }

    this.setState({ requestDetail, userDetail });
  };

  handleDateFormat = (date) => {
    return `${new Date(date).toLocaleDateString("de-DE")}`;
  };

  onMarkerClick = async (props, marker, e) => {
    //If props.id === 0, don't set it to state
    if (props.id !== "0") {
      await this.handleRequestDetails(props.id);
    }

    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      selectedLocation: props.position,
    });
  };

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  render() {
    const {
      userDetail,
      requestDetail,
      isRequestAssignedToDriver,
      isRequestOutForPickup,
      allAssignedJobs,
      activeMarker,
      showingInfoWindow,
      selectedPlace,
      selectedLocation,
    } = this.state;

    return (
      <React.Fragment>
        <div className="row mt-2 mb-2">
          <div className="col-12 col-sm-12 col-md-6 p-0">
            <h4>
              <i className="fas fa-route"></i> Pickup Packages
            </h4>
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col-12 p-0">
            {allAssignedJobs.length > 0 && (
              <Map
                google={this.props.google}
                zoom={12}
                style={mapStyles}
                initialCenter={{
                  lat: 24.8607,
                  lng: 67.0011,
                }}
              >
                <Marker
                  id="0"
                  onClick={this.onMarkerClick}
                  name={"GarbageCan-HQ"}
                  position={{
                    lat: 24.8607,
                    lng: 67.0011,
                  }}
                />
                {allAssignedJobs.map((element, index) => {
                  return (
                    <Marker
                      key={index}
                      id={element.idRequest}
                      onClick={this.onMarkerClick}
                      name={element.address}
                      position={{
                        lat: element.latitudes,
                        lng: element.longitudes,
                      }}
                    />
                  );
                })}
                <InfoWindow
                  marker={activeMarker}
                  visible={showingInfoWindow}
                  onClose={this.onClose}
                >
                  <div className="row">
                    <div className="col-12 mb-2" style={{ fontSize: "13px" }}>
                      <b>Address:</b> {selectedPlace.name}
                    </div>
                    <div className="col-12 mb-1">
                      <a
                        href={`https://maps.google.com/?q=${selectedLocation.lat},${selectedLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary width-100"
                      >
                        <i className="fas fa-map-marked-alt"></i> Open in Google
                        Maps
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              </Map>
            )}
          </div>
        </div>
        <div className="row mb-2" style={{ marginTop: "50%" }}>
          <div className="col-12 p-0">
            {isRequestAssignedToDriver && (
              <BannerAcceptPickup
                requestDetail={requestDetail}
                userDetail={userDetail}
                handleAcceptPickup={this.handleAcceptPickup}
              />
            )}
            {isRequestOutForPickup && (
              <BannerDetailedPickup
                requestDetail={requestDetail}
                userDetail={userDetail}
                handleUpdatePickupCosts={this.handleUpdatePickupCosts}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(DeliverPickups);
