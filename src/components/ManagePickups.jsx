import React from "react";
import Form from "./common/Form";
import Joi from "joi-browser";
import { toast } from "react-toastify";

import {
  getAllPickupsByUserId,
  createPickupRequest,
} from "../services/pickupService";
import authService from "../services/authService";
import { GetAllItems } from "../services/utilityService";

import ManagePickupGrid from "./common/ManagePickupGrid";

class ManagePickups extends Form {
  state = {
    data: {
      pickupDate: "",
      pickupTime: "",
      latitude: "",
      longitude: "",
    },
    errors: {},
    allPickups: [],
    isSpinner: false,
    isEditView: false,
    isGridView: false,
    currentUser: authService.getCurrentUser(),
    checkboxListSelection: [],
    checkboxList: [],
  };

  schema = {
    pickupDate: Joi.string().required().label("Pickup Date"),
    pickupTime: Joi.string().required().label("Pickup Time"),
    latitude: Joi.string().required().label("Latitude"),
    longitude: Joi.string().required().label("Longitude"),
  };

  async componentDidMount() {
    const { currentUser } = this.state;

    //Getting all pickups per user
    await this.getAllPickupsByUserId(currentUser.userId);

    //Set isGridView = true & isEditView = false
    this.setState({ isGridView: true, isEditView: false });

    //Getting all Items
    await this.getAllItems();
  }

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
    });
  };

  doSubmit_PickupRequestForm = async () => {
    //Activate Spinner
    this.isSpinnerActive(true);

    const { currentUser, checkboxListSelection, data } = this.state;

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
      data.latitude,
      data.longitude,
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
    } = this.state;

    if (allPickups.length === 0) {
      return (
        <div className="text-center mt-5">
          <span style={{ opacity: 0.7 }}>There are no requested pickups.</span>
        </div>
      );
    }

    return (
      <React.Fragment>
        {isGridView && (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12 col-sm-12 col-md-6">
                <h4>
                  <i className="fas fa-truck-pickup"></i> Pickups Management
                </h4>
              </div>
              <div className="col-12 col-sm-12 col-md-6 text-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleModes("edit")}
                >
                  <i className="fas fa-plus"></i>&nbsp;Create Pickup
                </button>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-12">
                <ManagePickupGrid allPickupsData={allPickups} />
              </div>
            </div>
          </React.Fragment>
        )}
        {isEditView && (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12 col-sm-12 col-md-6">
                <h4>
                  <i className="fas fa-plus"></i> Create Pickup
                </h4>
              </div>
              <div className="col-12 col-sm-12 col-md-6 text-right">
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
                className="col-12 mt-2"
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
                  <div className="col-12 col-sm-12 col-md-6">
                    {this.renderInputDisable(
                      "latitude",
                      "Latitude",
                      "number",
                      "Enter Latitude",
                      ""
                    )}
                  </div>
                  <div className="col-12 col-sm-12 col-md-6">
                    {this.renderInputDisable(
                      "longitude",
                      "Longitude",
                      "number",
                      "Enter Longitude",
                      ""
                    )}
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
