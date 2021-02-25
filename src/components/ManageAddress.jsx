import React from "react";
import Form from "./common/Form";
import Joi from "joi-browser";
import { toast } from "react-toastify";

import authService from "../services/authService";
import utilityService from "../services/utilityService";

class ManageAddress extends Form {
  state = {
    data: {
      address1: "",
      address2: "",
      city: "",
      province: "",
      country: "",
    },
    errors: {},
    userAddress: {},
    isUserAddressExists: false,
    isSpinner: false,
    isEditView: false,
    isGridView: false,
    currentUser: authService.getCurrentUser(),
  };

  schema = {
    address1: Joi.string().required().label("House No or Block No"),
    address2: Joi.string().required().label("Street Name"),
    city: Joi.string().required().label("City"),
    province: Joi.string().required().label("Province"),
    country: Joi.string().required().label("Country"),
  };

  async componentDidMount() {
    await this.getCurrentUserAddress();

    //Set isGridView = true & isEditView = false
    this.setState({ isGridView: true, isEditView: false });
  }

  getCurrentUserAddress = async () => {
    const { currentUser } = this.state;

    try {
      let address = await utilityService.GetUserDetailsById(currentUser.userId);

      this.setState({
        userAddress: address.data,
        isUserAddressExists: true,
      });
    } catch (error) {}
  };

  handleDataOnEditMode = () => {
    const { userAddress, data, isUserAddressExists } = this.state;

    if (isUserAddressExists) {
      //setting the address to state
      let cloneAddress = { ...data };
      cloneAddress.address1 = userAddress.address1;
      cloneAddress.address2 = userAddress.address2;
      cloneAddress.city = userAddress.city;
      cloneAddress.province = userAddress.province;
      cloneAddress.country = userAddress.country;

      this.setState({ data: cloneAddress });
    }
  };

  handleModes = (mode) => {
    if (mode === "grid") {
      //Set isGridView = true & isEditView = false
      this.setState({ isGridView: true, isEditView: false });
    } else if (mode === "edit") {
      //Setting the address on EDIT case
      this.handleDataOnEditMode();

      //Set isGridView = true & isEditView = false
      this.setState({ isGridView: false, isEditView: true });
    }
  };

  isSpinnerActive = (isSpinner) => {
    this.setState({ isSpinner: isSpinner });
  };

  identifyAddressProcess = () => {
    const { isUserAddressExists } = this.state;

    return isUserAddressExists ? "Update Address" : "Create Address";
  };

  doSubmit_AddressForm = async () => {
    //Activate Spinner
    this.isSpinnerActive(true);

    let isAddressModified = false;
    const { data, userAddress, isUserAddressExists, currentUser } = this.state;

    //Add to database Via service
    if (!isUserAddressExists) {
      //Returns an Object
      const { data: addressStatus } = await utilityService.CreateUserDetails(
        currentUser.userId,
        data.address1,
        data.address2,
        data.city,
        data.province,
        data.country
      );

      if (Object.keys(addressStatus).length > 0) {
        isAddressModified = true;
      }
    } else {
      //Returns a boolean
      const { data: addressStatus } = await utilityService.UpdateUserDetails(
        userAddress.idUserDetail,
        userAddress.idUser,
        data.address1,
        data.address2,
        data.city,
        data.province,
        data.country
      );

      isAddressModified = addressStatus;
    }

    if (isAddressModified) {
      //Update state with new address
      await this.getCurrentUserAddress();

      //Switch mode to grid
      this.handleModes("grid");

      toast.success("Address added/updated successfully.");
    } else {
      toast.error("Adding/Updating address failed! Please try again.");
    }

    //Deactivate Spinner
    this.isSpinnerActive(false);
  };

  render() {
    const {
      isGridView,
      isEditView,
      isUserAddressExists,
      userAddress,
      isSpinner,
    } = this.state;

    return (
      <React.Fragment>
        {isGridView && (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12 col-sm-12 col-md-6 p-0">
                <h4>
                  <i className="fas fa-map-marked-alt"></i> Address Management
                </h4>
              </div>
              <div className="col-12 col-sm-12 col-md-6 text-right p-0">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleModes("edit")}
                >
                  <i className="fas fa-plus"></i>&nbsp;
                  {this.identifyAddressProcess()}
                </button>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-12 p-0">
                {!isUserAddressExists && (
                  <React.Fragment>
                    <div className="text-center mt-5">
                      <span style={{ opacity: 0.7 }}>There is no address.</span>
                    </div>
                  </React.Fragment>
                )}
                {isUserAddressExists && (
                  <React.Fragment>
                    <div
                      className="card border-primary  mb-3"
                      style={{ maxWidth: "18rem" }}
                    >
                      <div className="card-body text-primary ">
                        <h5 className="card-title">Pickup Address</h5>
                        <p className="card-text">
                          <span>{userAddress.address1}</span> <br />
                          <span>
                            {userAddress.address2}, {userAddress.city}
                          </span>
                          <br />
                          <span>
                            {userAddress.province}, {userAddress.country}
                          </span>
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
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
                  <i className="fas fa-plus"></i>{" "}
                  {this.identifyAddressProcess()}
                </h4>
              </div>
              <div className="col-12 col-sm-12 col-md-6 text-right p-0">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleModes("grid")}
                >
                  <i className="fas fa-map-marked-alt"></i>&nbsp;Back to Address
                  Management
                </button>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-12 p-0">
                <form onSubmit={this.handleSubmit_AddressForm}>
                  {this.renderInput(
                    "address1",
                    "House No or Block No",
                    "text",
                    "Enter House No or Block No"
                  )}
                  {this.renderInput(
                    "address2",
                    "Street Name",
                    "text",
                    "Enter Street Name"
                  )}
                  {this.renderSelect(
                    "city",
                    "City",
                    [{ cityId: "Karachi", cityName: "Karachi" }],
                    "cityName",
                    "cityId",
                    "-- Select City --"
                  )}
                  {this.renderSelect(
                    "province",
                    "Province",
                    [{ provinceId: "Sindh", provinceName: "Sindh" }],
                    "provinceName",
                    "provinceId",
                    "-- Select Province --"
                  )}
                  {this.renderSelect(
                    "country",
                    "Country",
                    [{ countryId: "Pakistan", countryName: "Pakistan" }],
                    "countryName",
                    "countryId",
                    "-- Select Country --"
                  )}
                  {!isUserAddressExists &&
                    this.renderCustomButton(
                      "Create Address",
                      "btn btn-lg btn-primary btn-block mt-3",
                      isSpinner
                    )}
                  {isUserAddressExists &&
                    this.renderCustomButton(
                      "Update Address",
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

export default ManageAddress;
