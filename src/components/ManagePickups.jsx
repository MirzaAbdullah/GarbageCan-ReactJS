import React from "react";
import Form from "./common/Form";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import Geocode from "react-geocode";

//Services
import {
  getAllPickupsByUserId,
  createPickupRequest,
} from "../services/pickupService";
import authService from "../services/authService";
import { GetAllItems, GetUserDetailsById } from "../services/utilityService";

//Components
import ManagePickupGrid from "./common/ManagePickupGrid";

import MarkerMap from "./maps/MarkerMap";

// setting response language. Defaults to english.
Geocode.setLanguage("en");

// setting the google map key
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

// And according to the below google docs in description, ROOFTOP param returns the most accurate result.
Geocode.setLocationType("ROOFTOP");

class ManagePickups extends Form {
  state = {
    data: {
      pickupDate: "",
      pickupTime: "",
    },
    errors: {},
    allPickups: [],
    isSpinner: false,
    isEditView: false,
    isGridView: false,
    currentUser: authService.getCurrentUser(),
    checkboxListSelection: [],
    checkboxList: [],
    isUserHasAddress: false,
    userAddress: "",
    latitude: 0.0,
    longitude: 0.0,
  };

  schema = {
    pickupDate: Joi.string().required().label("Pickup Date"),
    pickupTime: Joi.string().required().label("Pickup Time"),
  };

  async componentDidMount() {
    const { currentUser } = this.state;

    //Getting all pickups per user
    await this.getAllPickupsByUserId(currentUser.userId);

    //Set isGridView = true & isEditView = false
    this.setState({ isGridView: true, isEditView: false });

    //Getting all Items
    await this.getAllItems();

    //Getting current user address
    await this.isUserHasAddress().then(() => this.getLatLngFromAddress());
  }

  async isUserHasAddress() {
    const { currentUser } = this.state;

    let isAddressExists = false,
      address = "";

    const { data: userDetails } = await GetUserDetailsById(currentUser.userId);

    if (userDetails.idUserDetail) {
      address = `${userDetails.address1}, ${userDetails.address2}, ${userDetails.city}, ${userDetails.province}, ${userDetails.country}`;
      isAddressExists = true;
    }

    this.setState({
      isUserHasAddress: isAddressExists,
      userAddress: address,
    });
  }

  getLatLngFromAddress = () => {
    const { userAddress } = this.state;

    // Get latitude & longitude from address.
    Geocode.fromAddress(userAddress).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({
          latitude: lat,
          longitude: lng,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  async getAllPickupsByUserId(userId) {
    const { data: pickups } = await getAllPickupsByUserId(userId);

    this.setState({ allPickups: pickups });
  }

  async getAllItems() {
    const { data: AllItems } = await GetAllItems();

    //Adding an element Inside the JSON object
    let processedItems = [...AllItems];
    processedItems.forEach((item, index) => {
      processedItems[index] = item = { ...item, isChecked: false };
    });

    this.setState({ checkboxList: processedItems });
  }

  handleModes = (mode) => {
    if (mode === "grid") {
      //Set isGridView = true & isEditView = false
      this.setState({ isGridView: true, isEditView: false });
    } else if (mode === "edit") {
      //Set isGridView = true & isEditView = false
      this.setState({ isGridView: false, isEditView: true });
    }
  };

  isSpinnerActive = (isSpinner) => {
    this.setState({ isSpinner: isSpinner });
  };

  resetControls = () => {
    this.setState({
      data: {
        pickupDate: "",
        pickupTime: "",
        latitude: "",
        longitude: "",
      },
      checkboxListSelection: [],
    });
  };

  doSubmit_PickupRequestForm = async () => {
    //Activate Spinner
    this.isSpinnerActive(true);

    const {
      currentUser,
      checkboxListSelection,
      data,
      latitude,
      longitude,
    } = this.state;

    //Generating object out of checkboxListSelection
    let requestDetails = checkboxListSelection.map((itemDetail) => {
      return {
        idRequestDetail: "",
        idRequest: "",
        idItem: itemDetail,
        itemName: "",
        itemWeight: 0,
        itemCost: 0,
      };
    });

    const { data: pickupDetails } = await createPickupRequest(
      currentUser.userId,
      data.pickupDate,
      data.pickupTime,
      latitude,
      longitude,
      requestDetails
    );

    if (Object.keys(pickupDetails).length > 0) {
      //Refresh the grid
      await getAllPickupsByUserId(currentUser.idUser);

      //Switch mode to grid
      this.handleModes("grid");

      //Reset the fields
      this.resetControls();

      toast.success("Pickup request generated successfully.");
    } else {
      toast.error("Request for pickup failed! Please try again.");
    }

    //Deactivate Spinner
    this.isSpinnerActive(false);
  };

  render() {
    const {
      allPickups,
      isEditView,
      isGridView,
      isSpinner,
      checkboxList,
      latitude,
      longitude,
      userAddress,
      isUserHasAddress,
    } = this.state;

    return (
      <React.Fragment>
        {isGridView && (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12 col-sm-12 col-md-6 p-0">
                <h4>
                  <i className="fas fa-truck-pickup"></i> Pickups Management
                </h4>
              </div>
              <div className="col-12 col-sm-12 col-md-6 text-right p-0">
                <button
                  type="button"
                  className="btn btn-primary"
                  id="btnCreatePickup"
                  onClick={() => this.handleModes("edit")}
                  disabled={!isUserHasAddress}
                  data-toggle="tooltip"
                  data-placement="left"
                  title="Button will be disabled, only if address is not registered."
                >
                  <i className="fas fa-plus"></i>&nbsp;Create Pickup
                </button>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-12 p-0">
                {allPickups.length === 0 && (
                  <React.Fragment>
                    <div className="text-center mt-5">
                      <span style={{ opacity: 0.7 }}>
                        There are no requested pickups.
                      </span>
                    </div>
                  </React.Fragment>
                )}
                {allPickups.length > 0 && (
                  <ManagePickupGrid allPickupsData={allPickups} />
                )}
              </div>
            </div>
          </React.Fragment>
        )}
        {isEditView && (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12 col-sm-12 col-md-6 p-0">
                <h4>
                  <i className="fas fa-plus"></i> Create Pickup
                </h4>
              </div>
              <div className="col-12 col-sm-12 col-md-6 text-right p-0">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleModes("grid")}
                >
                  <i className="fas fa-truck-pickup"></i> Back to Pickups
                  Management
                </button>
              </div>
              <form
                className="col-12 mt-2 mb-2 p-0"
                onSubmit={this.handleSubmit_PickupRequestForm}
              >
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6">
                    {this.renderInput(
                      "pickupDate",
                      "Pickup Date",
                      "text",
                      "Enter Pickup Date - Format (YYYY/MM/DD)"
                    )}
                  </div>
                  <div className="col-12 col-sm-12 col-md-6">
                    {this.renderInput(
                      "pickupTime",
                      "Pickup Time",
                      "text",
                      "Enter Pickup Time - Format (HH:MM:SS)"
                    )}
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 mb-3">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      value={userAddress}
                      className="form-control"
                      disabled
                    ></textarea>
                  </div>
                  <div className="col-12 mb-2">
                    <MarkerMap
                      isMarkerShown
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `400px` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                      latitude={latitude}
                      longitude={longitude}
                    />
                  </div>
                  <div className="col-12">
                    {this.renderCheckboxList(
                      "ItemCheckboxList",
                      "Pickup Items",
                      checkboxList
                    )}
                  </div>
                  <div className="col-12">
                    {this.renderCustomButton(
                      "Create Pickup",
                      "btn btn-lg btn-primary btn-block mt-3",
                      isSpinner
                    )}
                  </div>
                </div>
              </form>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default ManagePickups;
