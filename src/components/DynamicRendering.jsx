import React, { Component } from "react";
import UserManagement from "./UserManagement";
import AssignPickups from "./AssignPickups";
import DeliverPickups from "./DeliverPickups";
import ManageAddress from "./ManageAddress";
import ManagePickups from "./ManagePickups";
import ChangePassword from "./ChangePassword";
import VerifyAccount from "./VerifyAccount";

class DynamicRendering extends Component {
  components = {
    UserManagement: UserManagement,
    AssignPickups: AssignPickups,
    DeliverPickups: DeliverPickups,
    ManageAddress: ManageAddress,
    ManagePickups: ManagePickups,
    ChangePassword: ChangePassword,
    VerifyAccount: VerifyAccount,
  };
  render() {
    const { tag } = this.props;
    const TagName = this.components[tag];
    return <TagName />;
  }
}
export default DynamicRendering;
