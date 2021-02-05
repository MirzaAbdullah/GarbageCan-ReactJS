import React from "react";
import Joi from "joi-browser";
import Form from "./common/Form";
import authService from "../services/authService";
import { Redirect } from "react-router-dom";
import { Fragment } from "react";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await authService.login(data.username, data.password);

      //redirects to homePage or already selected page
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/approve";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;

        this.setState({ errors });
      }
    }
  };

  render() {
    if (authService.getCurrentUser()) return <Redirect to="/Approve" />;

    return (
      <Fragment>
        <div className="text-center Loginform_MT">
          <img
            className="mb-4"
            src="/GarbageCan_Logo.png"
            alt=""
            width="250"
            height="90"
          />
        </div>
        <div className="container mt-4">
          <div className="row">
            <div className="col-12 col-md-6 border-right">
              <div className="col-8 offset-2">
                <form onSubmit={this.handleSubmit}>
                  <div className="text-center">
                    <h1 className="h3 mb-3 font-weight-normal">Sign In</h1>
                  </div>
                  {this.renderInputWithoutLabel(
                    "username",
                    "Email",
                    "text",
                    "Enter Email"
                  )}
                  {this.renderInputWithoutLabel(
                    "password",
                    "Password",
                    "password",
                    "Enter Password"
                  )}
                  {this.renderCustomButton(
                    "Sign In",
                    "btn btn-lg btn-primary btn-block mt-3"
                  )}
                </form>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="col-8 offset-2">
                <form onSubmit={this.handleSubmit}>
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
                    "email",
                    "Email",
                    "text",
                    "Enter Email"
                  )}
                  {this.renderInputWithoutLabel(
                    "passwordSignUp",
                    "Password",
                    "password",
                    "Enter Password"
                  )}
                  {this.renderCustomButton(
                    "Sign Up",
                    "btn btn-lg btn-primary btn-block mt-3"
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default LoginForm;
