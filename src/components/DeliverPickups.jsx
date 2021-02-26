import React, { Component } from "react";
import { toast } from "react-toastify";

//Components
import Mapp from "./maps/mapp";
import BannerAcceptPickup from "./common/BannerAcceptPickup";
import BannerDetailedPickup from "./common/BannerDetailedPickup";

//Services
import {
  getPickupRequestById,
  updatePickupStatus,
  updateRequestDetailsByDriver,
} from "../services/pickupService";
import { GetUserDetailsById } from "../services/utilityService";

class DeliverPickups extends Component {
  state = {
    requestDetail: {},
    userDetail: {},
    isRequestAssignedToDriver: false,
    isRequestOutForPickup: false,
  };

  async componentDidMount() {
    //await this.handleRequestDetails("4bea10a024ca4ec78f122841bd53762d");
  }

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
    if (requestDetail.pickupStatus === "AssignedToDriver") {
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

  render() {
    const {
      userDetail,
      requestDetail,
      isRequestAssignedToDriver,
      isRequestOutForPickup,
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
            <Mapp></Mapp>
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

export default DeliverPickups;
