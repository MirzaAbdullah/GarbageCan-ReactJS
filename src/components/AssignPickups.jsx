import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import Form from "./common/Form";

//Services
import {
  getPickupRequestByStatus,
  getPickupRequestById,
} from "../services/pickupService";
import { GetUserDetailsById } from "../services/utilityService";
import { getUsersByRoleId } from "../services/authService";
import {
  assignPickup,
  getAllAssignPickupsByDriverId,
} from "../services/assignService";
import ManageAssignGrid from "./common/ManageAssignGrid";

class AssignPickups extends Form {
  state = {
    data: {
      ddlAllDrivers: "",
    },
    errors: {},
    allAssignedRequests: [],
    allPickupRequests: [],
    allDrivers: [],
    checkboxListSelection: [],
    checkboxList: [],
    isSpinner: false,
    isEditView: false,
    isGridView: false,
  };

  schema = {
    ddlAllDrivers: Joi.string().required().label("Drivers"),
  };

  async componentDidMount() {
    //Set isGridView = true & isEditView = false
    this.setState({ isGridView: true, isEditView: false });

    //Getting all Request
    await this.getAllAssignRequests();

    //Setting getPickup by Status = InProcess
    await this.getAllPickupRequestByStatus("InProcess");

    //Fill ddlDrivers
    await this.getAllDrivers();
  }

  handleDateFormat = (date) => {
    return `${new Date(date).toLocaleDateString("de-DE")}`;
  };

  getAllAssignRequests = async () => {
    let allDriversRequest = [];

    //Getting all Drivers
    const { data: drivers } = await getUsersByRoleId(2);
    drivers.forEach(async (driver) => {
      ///Getting current Driver All Request
      const driverRequestsList = await this.groupAllAssignedRequests(
        driver.idUser
      );

      allDriversRequest.push({
        driverId: driver.idUser,
        driverName: driver.name,
        driverEmail: driver.email,
        driverPhoneNo: driver.phoneNo,
        requestDetails: driverRequestsList,
      });
    });

    this.setState({ allAssignedRequests: allDriversRequest });
  };

  groupAllAssignedRequests = async (driverId) => {
    let allPickups = [];

    //Getting all Requests against Driver Id
    const { data: pickupRequests } = await getAllAssignPickupsByDriverId(
      driverId
    );

    pickupRequests.forEach(async (pickup) => {
      //Getting all Information for current Request Id
      const { data: pickupRequestData } = await getPickupRequestById(
        pickup.idRequest
      );

      //Getting Requested User Details
      const { data: userDetails } = await GetUserDetailsById(
        pickupRequestData.idUser
      );

      //Pushing data to allPickups Array
      allPickups.push({
        assignId: pickup.idAssign,
        requestId: pickup.idRequest,
        pickupDate: pickupRequestData.pickupDate,
        pickupTime: pickupRequestData.pickupTime,
        address: `${userDetails.address2}, ${userDetails.city}, ${userDetails.province}, ${userDetails.country}`,
      });
    });

    return allPickups;
  };

  async getAllPickupRequestByStatus(status) {
    const { data: pickupRequests } = await getPickupRequestByStatus(status);

    this.setState({ allPickupRequests: pickupRequests }, async () => {
      //Fill checkboxList
      await this.fillDDLFromRequests();
    });
  }

  async getAllDrivers() {
    //2: Drivers //3: Customers
    const { data: drivers } = await getUsersByRoleId(2);

    let allDrivers = [];
    drivers.forEach((driver) => {
      allDrivers.push({
        id: driver.idUser,
        value: `${driver.name} | ${driver.fullName} | ${driver.email}`,
      });
    });

    this.setState({ allDrivers });
  }

  async fillDDLFromRequests() {
    const { allPickupRequests } = this.state;

    //Getting elements for dropdown list out of all Assigned Request
    let ddlRequest = [];
    allPickupRequests
      .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate))
      .forEach(async (request) => {
        let { data: userDetail } = await GetUserDetailsById(request.idUser);
        let address = `${this.handleDateFormat(request.pickupDate)} - ${
          request.pickupTime
        } | ${userDetail.address2}, ${userDetail.city}, ${
          userDetail.province
        }, ${userDetail.country}`;

        ddlRequest.push({
          itemName: address,
          idItem: request.idRequest,
          isChecked: false,
        });
      });

    this.setState({ checkboxList: ddlRequest });
  }

  resetControls = async () => {
    this.setState({
      data: {
        ddlAllDrivers: "",
      },
      checkboxListSelection: [],
    });

    //Setting getPickup by Status
    await this.getAllPickupRequestByStatus("InProcess");
  };

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

  doSubmit_AssignPickupForm = async () => {
    //Activate Spinner
    this.isSpinnerActive(true);

    const { checkboxListSelection, data } = this.state;

    const { data: assignData } = await assignPickup(
      data.ddlAllDrivers,
      checkboxListSelection
    );

    if (assignData) {
      //Refresh the grid
      await this.getAllAssignRequests();

      //Switch mode to grid
      this.handleModes("grid");

      //Reset the fields
      this.resetControls();

      toast.success("Pickup's assigned successfully.");
    } else {
      toast.error("Assigning pickups failed! Please try again.");
    }

    //De-activate Spinner
    this.isSpinnerActive(false);
  };

  render() {
    const {
      allDrivers,
      checkboxList,
      isGridView,
      isEditView,
      isSpinner,
      allAssignedRequests,
    } = this.state;

    return (
      <React.Fragment>
        {isGridView && (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12 col-sm-12 col-md-6 p-0">
                <h4>
                  <i className="fas fa-dolly"></i> Assign Pickup's Management
                </h4>
              </div>
              <div className="col-12 col-sm-12 col-md-6 text-right p-0">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleModes("edit")}
                >
                  <i className="fas fa-plus"></i>&nbsp;Assign Pickup
                </button>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-12 p-0">
                {allAssignedRequests.length === 0 && (
                  <React.Fragment>
                    <div className="text-center mt-5">
                      <span style={{ opacity: 0.7 }}>
                        There are no assigned requests.
                      </span>
                    </div>
                  </React.Fragment>
                )}
                {allAssignedRequests.length > 0 && (
                  <ManageAssignGrid allAssignPickupData={allAssignedRequests} />
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
                  <i className="fas fa-plus"></i> Assign Pickup
                </h4>
              </div>
              <div className="col-12 col-sm-12 col-md-6 text-right p-0">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleModes("grid")}
                >
                  <i className="fas fa-dolly"></i>&nbsp;Back to Assign Pickup's
                  Management
                </button>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-12 p-0">
                <form onSubmit={this.handleSubmit_AssignPickupForm}>
                  {this.renderSelect(
                    "ddlAllDrivers",
                    "Drivers",
                    allDrivers,
                    "value",
                    "id"
                  )}
                  {this.renderCheckboxList(
                    "ItemCheckboxList",
                    "Pickup Requests",
                    checkboxList
                  )}
                  {this.renderCustomButton(
                    "Assign Request",
                    "btn btn-lg btn-primary btn-block mt-3",
                    isSpinner
                  )}
                </form>
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default AssignPickups;
