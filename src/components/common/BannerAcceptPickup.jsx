import React from "react";

const BannerAcceptPickup = ({
  requestDetail,
  userDetail,
  handleAcceptPickup,
}) => {
  function getFullAddress() {
    const { address1, address2, city, province, country } = userDetail;

    return `${address1}, ${address2}, ${city}, ${province}, ${country}`;
  }

  function handleDateFormat(date) {
    return `${new Date(date).toLocaleDateString("de-DE")}`;
  }

  return (
    <div className="alert alert-primary" role="alert">
      {requestDetail.pickupStatus === "AssignedToDriver" && (
        <React.Fragment>
          <div className="row p-0">
            <div className="col-12 col-md-10">
              <div className="col p-0">
                <b>Pickup Address:</b> {userDetail && getFullAddress()}
              </div>
              <hr style={{ margin: "2px" }} />
              <div className="row">
                <div className="col-12 col-md-4">
                  <b>Phone:</b>{" "}
                  {requestDetail.userData && requestDetail.userData.phoneNo}
                </div>
                <div className="col-12 col-md-4">
                  <b>Pickup Date:</b>{" "}
                  {requestDetail && handleDateFormat(requestDetail.pickupDate)}
                </div>
                <div className="col-12 col-md-4">
                  <b>Pickup Time:</b>{" "}
                  {requestDetail && requestDetail.pickupTime}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-2 text-center">
              <a
                href="#/"
                onClick={() => handleAcceptPickup(requestDetail.idRequest)}
                type="button"
                className="btn btn-success"
                style={{ marginTop: "8px" }}
              >
                Accept
              </a>
            </div>
          </div>
        </React.Fragment>
      )}
      {requestDetail.pickupStatus !== "AssignedToDriver" && (
        <React.Fragment>
          <span>
            <i className="fas fa-check-circle text-success"></i> Package already
            picked from this location
          </span>
        </React.Fragment>
      )}
    </div>
  );
};

export default BannerAcceptPickup;
