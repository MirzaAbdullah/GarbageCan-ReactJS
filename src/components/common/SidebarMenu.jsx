import React from "react";
import $ from "jquery";
import { Fragment } from "react";

const SidebarMenu = ({ userRole, onItemSelect }) => {
  function deactivateAllMenus() {
    $(".list-group>.list-group-item").removeClass("active");
  }

  return (
    <Fragment>
      <div className="list-group" id="list-tab" role="tablist">
        {userRole === "1" && (
          <Fragment>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => {
                onItemSelect("UserManagement");
                deactivateAllMenus();
                $("#UserManagement").addClass("active");
              }}
              id="UserManagement"
            >
              User Management
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => {
                onItemSelect("AssignPickups");
                deactivateAllMenus();
                $("#AssignPickups").addClass("active");
              }}
              id="AssignPickups"
            >
              Assign Pickup's
            </button>
          </Fragment>
        )}
        {userRole === "3" && (
          <Fragment>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => {
                onItemSelect("ManageAddress");
                deactivateAllMenus();
                $("#ManageAddress").addClass("active");
              }}
              id="ManageAddress"
            >
              Manage Address
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => {
                onItemSelect("ManagePickups");
                deactivateAllMenus();
                $("#ManagePickups").addClass("active");
              }}
              id="ManagePickups"
            >
              Manage Pickup's
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => {
                onItemSelect("VerifyAccount");
                deactivateAllMenus();
                $("#VerifyAccount").addClass("active");
              }}
              id="VerifyAccount"
            >
              Verify Account
            </button>
          </Fragment>
        )}
        {userRole === "2" && (
          <button
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => {
              onItemSelect("DeliverPickups");
              deactivateAllMenus();
              $("#DeliverPickups").addClass("active");
            }}
            id="DeliverPickups"
          >
            Deliver Pickup'ss
          </button>
        )}
        <button
          type="button"
          className="list-group-item list-group-item-action"
          onClick={() => {
            onItemSelect("ChangePassword");
            deactivateAllMenus();
            $("#ChangePassword").addClass("active");
          }}
          id="ChangePassword"
        >
          Change Password
        </button>
      </div>
    </Fragment>
  );
};

export default SidebarMenu;
