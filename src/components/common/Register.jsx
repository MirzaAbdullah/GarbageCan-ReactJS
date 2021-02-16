import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import authService from "../../services/authService";
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
    isSpinner: false,
  };

  schema = {
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    phoneNo: Joi.string().required().label("Phone Number"),
    name: Joi.string().required().label("Username"),
    emailRegister: Joi.string().required().label("Email"),
    passwordRegister: Joi.string().required().label("Password"),
  };

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

      const { data: userModel, currentUser } = this.state;

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
        await authService.register(
          userModel.emailRegister,
          userModel.passwordRegister,
          userModel.firstName,
          userModel.lastName,
          userModel.name,
          userModel.phoneNo,
          currentUser ? userModel.roleId : 3,
          true
        );

        //redirects to homePage or already selected page
        window.location = this.props.location
          ? this.props.location.from.pathname
          : "/dashboard";
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
    const { currentUser, isSpinner } = this.state;
    const { handleModes } = this.props;

    if (currentUser) return <Redirect to="/dashboard" />;

    return (
      <form onSubmit={this.handleSubmit_RegisterForm}>
        <div className="text-center mb-3">
          <h6 className="h5">Welcome to GarbageCAN (Pvt.) Ltd</h6>
          <span>
            Please register below or{" "}
            <a href="javascript:void(0)" onClick={() => handleModes("login")}>
              already have account?
            </a>
          </span>
        </div>
        <div className="mb-2">
          {this.renderInputWithoutLabel(
            "firstName",
            "First Name",
            "text",
            "Enter First Name"
          )}
        </div>
        <div className="mb-2">
          {this.renderInputWithoutLabel(
            "lastName",
            "Last Name",
            "text",
            "Enter Last Name"
          )}
        </div>
        <div className="mb-2">
          {this.renderInputWithoutLabel(
            "phoneNo",
            "Phone Number",
            "number",
            "Enter Phone Number"
          )}
        </div>
        <div className="mb-2">
          {this.renderInputWithoutLabel(
            "name",
            "Username",
            "text",
            "Enter Username"
          )}
        </div>
        <div className="mb-2">
          {this.renderInputWithoutLabel(
            "emailRegister",
            "Email",
            "email",
            "Enter Email"
          )}
        </div>
        <div className="mb-2">
          {this.renderInputWithoutLabel(
            "passwordRegister",
            "Password",
            "password",
            "Enter Password"
          )}
        </div>
        {this.renderCustomButton(
          "Sign Up",
          "btn btn-lg btn-primary btn-block mt-3",
          isSpinner
        )}
      </form>
    );
  }
}

export default Register;
