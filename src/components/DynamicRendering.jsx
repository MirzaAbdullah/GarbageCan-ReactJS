import React, { Component } from "react";
import UserManagement from "./UserManagement";
import AssignPickups from "./AssignPickups";
import DeliverPickups from "./DeliverPickups";
import ManageAddress from "./ManageAddress";
import ManagePickups from "./ManagePickups";

class DynamicRendering extends Component {
  components = {
    UserManagement: UserManagement,
    AssignPickups: AssignPickups,
    DeliverPickups: DeliverPickups,
    ManageAddress: ManageAddress,
    ManagePickups: ManagePickups,
  };
  render() {
    const TagName = this.components[this.props.tag || "User"];
    return <TagName />;
  }
}
export default DynamicRendering;
