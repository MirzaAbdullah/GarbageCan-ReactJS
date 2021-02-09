import React from "react";
import { Fragment } from "react";

const SidebarMenu = ({ userRole, onItemSelect }) => {
  return (
    <Fragment>
      <div className="list-group">
        {userRole === "1" && (
          <Fragment>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => onItemSelect("UserManagement")}
            >
              User Management
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => onItemSelect("AssignPickups")}
              id="AssignPickups"
            >
              Assign Pickups
            </button>
          </Fragment>
        )}
        {userRole === "3" && (
          <Fragment>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => onItemSelect("ManageAddress")}
              id="ManageAddress"
            >
              Manage Address
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => onItemSelect("ManagePickups")}
              id="ManagePickups"
            >
              Manage Pickups
            </button>
          </Fragment>
        )}
        {userRole === "2" && (
          <button
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => onItemSelect("DeliverPickups")}
            id="DeliverPickups"
          >
            Deliver Pickups
          </button>
        )}
        <button
          type="button"
          className="list-group-item list-group-item-action"
          onClick={() => onItemSelect("ChangePassword")}
          id="ChangePassword"
        >
          Change Password
        </button>
      </div>
    </Fragment>
  );
};

export default SidebarMenu;
