import React from "react";
import Joi from "joi-browser";
import Form from "./common/Form";
import $ from "jquery";
import { toast } from "react-toastify";
import ModalConfirmation from "./common/ModalConfirmation";

import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import { getAllUsers, deactivateUserAccount } from "../services/userService";
import authService from "../services/authService";
import utilityService from "../services/utilityService";

class UserManagement extends Form {
  state = {
    allUsers: [],
    data: {
      firstName: "",
      lastName: "",
      phoneNo: "",
      name: "",
      emailRegister: "",
      passwordRegister: "",
      roleId: "",
    },
    errors: {},
    roles: [],
    selectedKey: "",
    currentUser: authService.getCurrentUser(),
    isSpinner: false,
    isEditView: false,
    isGridView: false,
  };

  schema = {
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    phoneNo: Joi.string().required().label("Phone Number"),
    name: Joi.string().required().label("Username"),
    emailRegister: Joi.string().required().label("Email"),
    passwordRegister: Joi.string().required().label("Password"),
    roleId: Joi.string().required().label("Roles"),
  };

  useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  async componentDidMount() {
    const { currentUser, data } = this.state;

    //If User is LoggedIn add roleId key in this.state.data to enable joi validation on roles dropdown
    if (currentUser) {
      const cloneData = { ...data };
      cloneData["roleId"] = "";
      this.setState({ data: cloneData });
    }

    //Getting Roles from Api Service
    await this.getAllRoles();

    //Getting all users from Api Service
    this.handleGetAllUsers();

    //Set isGridView = true & isEditView = false
    this.setState({ isGridView: true, isEditView: false });
  }

  handleModes = (mode) => {
    if (mode === "grid") {
      //Set isGridView = true & isEditView = false
      this.setState({ isGridView: true, isEditView: false });
    } else if (mode === "edit") {
      //Set isGridView = true & isEditView = false
      this.setState({ isGridView: false, isEditView: true });
    }
  };

  handleGetAllUsers = async () => {
    const { data } = await getAllUsers();
    this.setState({ allUsers: data });
  };

  resetControls = () => {
    this.setState({
      data: {
        firstName: "",
        lastName: "",
        phoneNo: "",
        name: "",
        emailRegister: "",
        passwordRegister: "",
        roleId: "",
      },
    });
  };

  handleDateFormat = (date) => {
    return `${new Date(date).toLocaleDateString("de-DE")}`;
  };

  handleVerifiedIcon = (flag) => {
    if (flag) {
      return "fas fa-check-circle text-success";
    }
    return "fas fa-times-circle text-danger";
  };

  updateSelectedKey = (key) => {
    this.setState({
      selectedKey: key,
    });
  };

  handleDeleteAccount = async (userId) => {
    const { data } = await deactivateUserAccount(userId);

    if (data === true) {
      const { allUsers } = this.state;

      //Change Bit from true to false
      const userIndex = allUsers.findIndex((user) => user.idUser);
      let cloneAllUsers = [...allUsers];

      cloneAllUsers[userIndex] = {
        ...cloneAllUsers[userIndex],
        isVerified: false,
      };

      //update state
      this.setState({ allUsers: cloneAllUsers });

      //Hide modal
      $(".garbageCanModal").modal("hide");

      //display toaster
      toast.success("User Account Deactivated Successfully");
    } else {
      toast.error("Deactivating user account failed! Please try again. ");
    }
  };

  async getAllRoles() {
    //get all roles
    const { data: roles } = await utilityService.getAllRoles();
    this.setState({ roles });
  }

  async isUserNameExists(username) {
    return await authService.isUserNameExists(username);
  }

  async isEmailExists(email) {
    return await authService.isUserEmailExists(email);
  }

  isSpinnerActive = (isSpinner) => {
    this.setState({ isSpinner: isSpinner });
  };

  doSubmit_RegisterForm = async () => {
    try {
      //Activate the button Spinner
      this.isSpinnerActive(true);

      const { data: userModel } = this.state;

      //Check if UserName Already Exists
      const { data: isUserNameExists } = await this.isUserNameExists(
        userModel.name
      );

      //Check if Email Already Exists
      const { data: isEmailExists } = await this.isEmailExists(
        userModel.emailRegister
      );

      //Setting Error state for Register Component when username & email already exists
      if (isUserNameExists || isEmailExists) {
        let errorArr = {};

        if (isUserNameExists) {
          errorArr.name = "Username already exists! Try another.";
        }

        if (isEmailExists) {
          errorArr.emailRegister = "Email Address already exists! Try another.";
        }

        this.setState({
          errors: errorArr,
        });
      }

      if (Object.entries(this.state.errors).length === 0) {
        const { data: jwt } = await authService.register(
          userModel.emailRegister,
          userModel.passwordRegister,
          userModel.firstName,
          userModel.lastName,
          userModel.name,
          userModel.phoneNo,
          userModel.roleId,
          false
        );

        if (jwt !== "") {
          //Refresh the grid
          this.handleGetAllUsers();

          //Switch mode to grid
          this.handleModes("grid");

          //Reset the fields
          this.resetControls();

          toast.success("User is registered successfully.");
        } else {
          toast.error("User isn't registered! Please try again.");
        }
      }

      //Activate the button Spinner
      this.isSpinnerActive(false);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const {
        allUsers,
        isSpinner,
        isEditView,
        isGridView,
        selectedKey,
      } = this.state,
      cursorPointer = {
        cursor: "pointer",
      };

    if (allUsers.length === 0) {
      return (
        <div className="text-center mt-5">
          <span style={{ opacity: 0.7 }}>There are no registered users</span>
        </div>
      );
    }

    return (
      <div className="row mt-2">
        {isGridView && (
          <React.Fragment>
            <div className="col-12 col-sm-12 col-md-6">
              <h4>
                <i className="fas fa-users"></i> User Management
              </h4>
            </div>
            <div className="col-12 col-sm-12 col-md-6 text-right">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.handleModes("edit")}
              >
                <i className="fas fa-plus"></i> Add User
              </button>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-12">
                <TableContainer component={Paper}>
                  <Table
                    className={this.useStyles.table}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-weight-bold">Name</TableCell>
                        <TableCell className="font-weight-bold">
                          Email
                        </TableCell>
                        <TableCell className="font-weight-bold">
                          Phone No
                        </TableCell>
                        <TableCell className="font-weight-bold">Role</TableCell>
                        <TableCell className="font-weight-bold">Date</TableCell>
                        <TableCell className="font-weight-bold">
                          Verified
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allUsers
                        .sort(
                          (a, b) =>
                            new Date(b.createdDate) - new Date(a.createdDate)
                        )
                        .map((allUser) => (
                          <TableRow key={allUser.idUser}>
                            <TableCell component="th" scope="row">
                              {allUser.name}
                            </TableCell>
                            <TableCell>{allUser.email}</TableCell>
                            <TableCell>{allUser.phoneNo}</TableCell>
                            <TableCell>{allUser.nameRole}</TableCell>
                            <TableCell>
                              {this.handleDateFormat(allUser.createdDate)}
                            </TableCell>
                            <TableCell className="text-center">
                              <i
                                className={this.handleVerifiedIcon(
                                  allUser.isVerified
                                )}
                              ></i>
                            </TableCell>
                            <TableCell>
                              <a
                                onClick={() =>
                                  this.updateSelectedKey(allUser.idUser)
                                }
                                data-toggle="modal"
                                data-target="#garbageCanModal"
                                href="/#"
                                className="text-danger ml-1"
                                style={cursorPointer}
                              >
                                <i className="far fa-2x fa-trash-alt"></i>
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <ModalConfirmation
              modalHeader="Delete User"
              modalBody="Are you sure want to delete this user ?"
              modalButtonText="Delete User"
              modalKey={selectedKey}
              modalButtonOperation={this.handleDeleteAccount}
            ></ModalConfirmation>
          </React.Fragment>
        )}
        {isEditView && (
          <React.Fragment>
            <div className="col-12 col-sm-12 col-md-6">
              <h4>
                <i className="fas fa-plus"></i> Add User
              </h4>
            </div>
            <div className="col-12 col-sm-12 col-md-6 text-right">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.handleModes("grid")}
              >
                <i className="fas fa-users"></i> Back to User Management
              </button>
            </div>
            <div className="col-12 col-sm-12 col-md-12 mt-2 mb-2">
              <form onSubmit={this.handleSubmit_RegisterForm}>
                {this.renderInput(
                  "firstName",
                  "First Name",
                  "text",
                  "Enter First Name"
                )}
                {this.renderInput(
                  "lastName",
                  "Last Name",
                  "text",
                  "Enter Last Name"
                )}
                {this.renderInput(
                  "phoneNo",
                  "Phone Number",
                  "number",
                  "Enter Phone Number"
                )}
                {this.renderInput("name", "Username", "text", "Enter Username")}
                {this.renderInput(
                  "emailRegister",
                  "Email",
                  "email",
                  "Enter Email"
                )}
                {this.renderInput(
                  "passwordRegister",
                  "Password",
                  "password",
                  "Enter Password"
                )}
                {this.renderSelect(
                  "roleId",
                  "Roles",
                  this.state.roles,
                  "roleName",
                  "roleId"
                )}
                {this.renderCustomButton(
                  "Add User",
                  "btn btn-lg btn-primary btn-block mt-3",
                  isSpinner
                )}
              </form>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default UserManagement;
