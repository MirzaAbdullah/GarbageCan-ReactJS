import React from "react";
import Joi from "joi-browser";
import $ from "jquery";
import Form from "./Form";

class BannerDetailedPickup extends Form {
  state = {
    data: {
      pickupCost: 0,
    },
    errors: {},
    isSpinner: false,
  };

  schema = {
    pickupCost: Joi.number().required().label("Pickup Cost"),
  };

  getFullAddress = () => {
    const {
      address1,
      address2,
      city,
      province,
      country,
    } = this.props.userDetail;

    return `${address1}, ${address2}, ${city}, ${province}, ${country}`;
  };

  getFullName = () => {
    const { userData } = this.props.requestDetail;

    return `${userData.firstName} ${userData.lastName}`;
  };

  handleDateFormat = (date) => {
    return `${new Date(date).toLocaleDateString("de-DE")}`;
  };

  isSpinnerActive = (isSpinner) => {
    this.setState({ isSpinner: isSpinner });
  };

  doSubmit_PickupUpdateByDriverForm = async () => {
    //Activate the button Spinner
    this.isSpinnerActive(true);

    const { data } = this.state;
    const { requestDetail } = this.props;
    let requestDetails = [];

    //Getting weights for updated pickups
    requestDetail.requestDetails.forEach((element) => {
      requestDetails.push({
        idRequestDetail: element.idRequestDetail,
        idRequest: element.idRequest,
        idItem: element.idItem,
        itemName: element.itemName,
        itemWeight: parseFloat(
          $(`#${element.idRequestDetail}_${element.idItem}`).val()
        ),
        itemCost: parseFloat(element.itemCost),
      });
    });

    //Calling parent method
    this.props.handleUpdatePickupCosts(
      requestDetail.idRequest,
      data.pickupCost,
      requestDetails
    );

    //Activate the button Spinner
    this.isSpinnerActive(false);
  };

  render() {
    const { requestDetail, userDetail } = this.props;
    const { isSpinner } = this.state;

    return (
      <React.Fragment>
        <div className="alert alert-primary" role="alert">
          <h4 className="alert-heading">
            {requestDetail.userData && this.getFullName()}
          </h4>
          <div className="row">
            <div className="col-12 col-md-4">
              <b>Phone:</b>{" "}
              {requestDetail.userData && requestDetail.userData.phoneNo}
            </div>
            <div className="col-12 col-md-4">
              <b>Pickup Date:</b>{" "}
              {requestDetail && this.handleDateFormat(requestDetail.pickupDate)}
            </div>
            <div className="col-12 col-md-4">
              <b>Pickup Time:</b> {requestDetail && requestDetail.pickupTime}
            </div>
            <div className="col-12">
              <b>Pikcup Address:</b> {userDetail && this.getFullAddress()}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12">
              <form onSubmit={this.handleSubmit_PickupUpdateByDriverForm}>
                <div className="col-12 col-md-4 p-0">
                  {this.renderInput(
                    "pickupCost",
                    "Pickup Cost (PKR)",
                    "number",
                    "Enter Pickup Cost"
                  )}
                </div>
                <div className="col-12 table-responsive p-0">
                  <table className="table table-bordered" id="tblPickupUpdate">
                    <thead>
                      <tr>
                        <th className="">Item</th>
                        <th className="">Weight (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestDetail.requestDetails &&
                        requestDetail.requestDetails.map((element) => (
                          <tr key={element.idRequestDetail}>
                            <td>{element.itemName}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                id={`${element.idRequestDetail}_${element.idItem}`}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {this.renderCustomButton(
                  "Complete Pickup",
                  "btn btn-lg btn-success btn-block mt-3",
                  isSpinner
                )}
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BannerDetailedPickup;
