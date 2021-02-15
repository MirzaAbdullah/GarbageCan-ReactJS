import React, { Component } from "react";
import { Fragment } from "react";
import authService from "../services/authService";
import SidebarMenu from "./common/SidebarMenu";
import DynamicRendering from "./DynamicRendering";
import { Redirect } from "react-router-dom";

class Dashboard extends Component {
  state = {
    currentUser: {},
    selectedMenuItem: "",
  };

  componentDidMount() {
    this.setState({ currentUser: authService.getCurrentUser() });
  }

  handleSelectedSideMenu = (selectedMenu) => {
    this.setState({ selectedMenuItem: selectedMenu });
  };

  render() {
    const { currentUser, selectedMenuItem } = this.state;
    if (!currentUser) return <Redirect to="/" />;

    return (
      <Fragment>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-3">
            <div className="text-center">
              <img
                className="mb-1"
                src="/GarbageCan_Logo.png"
                alt="GarbageCan Offical Logo"
                width="200"
                height="75"
              />
            </div>
            <SidebarMenu
              userRole={currentUser.uRoleId}
              onItemSelect={this.handleSelectedSideMenu}
            />
          </div>
          <div className="col-12 col-sm-12 col-md-9">
            {selectedMenuItem && <DynamicRendering tag={selectedMenuItem} />}
            {selectedMenuItem === "" && (
              <div className="text-center mt-5">
                <span style={{ opacity: 0.7 }}>
                  Please select an option from sidebar to load data here.
                </span>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Dashboard;
