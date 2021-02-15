import React from "react";
import Form from "./common/Form";
import Joi from "joi-browser";
import $ from "jquery";
import { toast } from "react-toastify";

import {
  getAllPickupsByUserId,
  createPickupRequest,
} from "../services/pickupService";
import authService from "../services/authService";
import { GetAllItems } from "../services/utilityService";

import ManagePickupGrid from "./common/ManagePickupGrid";
import CheckBoxList from "./common/CheckboxList";

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
    checkboxListSelection: "",
    checkboxListError: "",
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
    const { data } = await GetAllItems();

    this.setState({ checkboxList: data });
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

  render() {
    const {
      allPickups,
      isEditView,
      isGridView,
      isSpinner,
      checkboxListSelection,
      checkboxListError,
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
              <form className="col-12 mt-2">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6">
                    {this.renderInput(
                      "pickupDate",
                      "Pickup Date",
                      "text",
                      "Enter Pickup Date MM/DD/YYYY"
                    )}
                  </div>
                  <div className="col-12 col-sm-12 col-md-6">
                    {this.renderInput(
                      "pickupTime",
                      "Pickup Time",
                      "text",
                      "Enter Pickup Time (HH:MM:SS)"
                    )}
                  </div>
                  <div className="col-12 col-sm-12 col-md-6">
                    {this.renderInputDisable(
                      "latitude",
                      "Latitude",
                      "number",
                      "Enter Latitude",
                      "disabled"
                    )}
                  </div>
                  <div className="col-12 col-sm-12 col-md-6">
                    {this.renderInputDisable(
                      "longitude",
                      "Longitude",
                      "number",
                      "Enter Longitude",
                      "disabled"
                    )}
                  </div>
                  <div className="col-12">
                    <label htmlFor={checkboxListSelection}>My Items</label>
                    <br />
                    <CheckBoxList
                      name={checkboxListSelection}
                      error={checkboxListError}
                      itemList={checkboxList}
                    />
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
