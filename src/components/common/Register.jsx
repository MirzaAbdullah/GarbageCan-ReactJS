import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import authService from "../../services/authService";
import utilityService from "../../services/utilityService";
import { Redirect } from "react-router-dom";

class Register extends Form {
  state = {
    data: {
      firstName: "",
      lastName: "",
      phoneNo: "",
      name: "",
      emailRegister: "",
      passwordRegister: "",
    },
    errors: {},
    roles: [],
    currentUser: authService.getCurrentUser(),
  };

  schema = {
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    phoneNo: Joi.string().required().label("Phone Number"),
    name: Joi.string().required().label("Username"),
    emailRegister: Joi.string().required().label("Email"),
    passwordRegister: Joi.string().required().label("Password"),
  };

  async componentDidMount() {
    //If User is LoggedIn add roleId key in this.state.data to enable joi validation on roles dropdown
    if (this.state.currentUser) {
      const cloneData = { ...this.state.data };
      cloneData["roleId"] = "";
      this.setState({ data: cloneData });
    }

    //Getting Roles from Api Service
    await this.getAllRoles();
  }

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

  doSubmit_RegisterForm = async () => {
    try {
      const { data: userModel, currentUser } = this.state;

      //Check if UserName Already Exists
      const { data: isUserNameExists } = await this.isUserNameExists(
        userModel.name
      );

      //Check if Email Already Exists
      const { data: isEmailExists } = await this.isEmailExists(
        userModel.emailRegister
      );

      if (isUserNameExists || isEmailExists) {
        let errorArr = {};

        if (isUserNameExists) {
          errorArr = { name: "Username already exists! Try another." };
        }

        if (isEmailExists) {
          errorArr = {
            ...errorArr,
            emailRegister: "Email Address already exists! Try another.",
          };
        }

        this.setState({
          errors: errorArr,
        });
      }

      await authService.register(
        userModel.emailRegister,
        userModel.passwordRegister,
        userModel.firstName,
        userModel.lastName,
        userModel.name,
        userModel.phoneNo,
        currentUser ? userModel.roleId : 3
      );
      //redirects to homePage or already selected page
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/dashboard";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { currentUser } = this.state;
    if (currentUser) return <Redirect to="/dashboard" />;

    return (
      <form onSubmit={this.handleSubmit_RegisterForm}>
        <div className="text-center">
          <h1 className="h3 mb-3 font-weight-normal">Sign Up</h1>
        </div>
        {this.renderInputWithoutLabel(
          "firstName",
          "First Name",
          "text",
          "Enter First Name"
        )}
        {this.renderInputWithoutLabel(
          "lastName",
          "Last Name",
          "text",
          "Enter Last Name"
        )}
        {this.renderInputWithoutLabel(
          "phoneNo",
          "Phone Number",
          "number",
          "Enter Phone Number"
        )}
        {this.renderInputWithoutLabel(
          "name",
          "Username",
          "text",
          "Enter Username"
        )}
        {this.renderInputWithoutLabel(
          "emailRegister",
          "Email",
          "email",
          "Enter Email"
        )}
        {this.renderInputWithoutLabel(
          "passwordRegister",
          "Password",
          "password",
          "Enter Password"
        )}
        {currentUser &&
          this.renderSelectWithoutLabel(
            "roleId",
            "Roles",
            this.state.roles,
            "roleName",
            "roleId"
          )}
        {this.renderCustomButton(
          "Sign Up",
          "btn btn-lg btn-primary btn-block mt-3"
        )}
      </form>
    );
  }
}

export default Register;
