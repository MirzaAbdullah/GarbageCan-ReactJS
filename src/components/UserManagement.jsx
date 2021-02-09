import React, { Component } from "react";

class UserManagement extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="row mt-2">
          <div className="col-6">
            <h4>User Management</h4>
          </div>
          <div className="col-6 text-right">
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Add User
            </button>
          </div>
          <div className="row mt-3">
            <div className="col-12"></div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserManagement;
