import React from "react";
import Joi from "joi-browser";
import Form from "./common/Form";
import authService from "../services/authService";
import { Redirect } from "react-router-dom";
import { Fragment } from "react";
import Register from "./common/Register";

class AuthenticationForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
    isSpinner: false,
  };

  schema = {
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  isSpinnerActive = (isSpinner) => {
    this.setState({ isSpinner: isSpinner });
  };

  doSubmit_LoginForm = async () => {
    try {
      //Activate the button Spinner
      this.isSpinnerActive(true);

      const { data } = this.state;
      await authService.login(data.email, data.password);

      //Activate the button Spinner
      this.isSpinnerActive(false);

      //redirects to homePage or already selected page
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/dashboard";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;

        this.setState({ errors });
      }
    }
  };

  render() {
    const { isSpinner } = this.state;

    if (authService.getCurrentUser()) return <Redirect to="/dashboard" />;

    return (
      <Fragment>
        <div className="text-center Loginform_MT">
          <img
            className="mb-4"
            src="/GarbageCan_Logo.png"
            alt="GarbageCan Offical Logo"
            width="250"
            height="90"
          />
        </div>
        <div className="container mt-4">
          <div className="row">
            <div className="col-12 col-md-6 border-right">
              <div className="col-8 offset-2">
                <form onSubmit={this.handleSubmit_LoginForm}>
                  <div className="text-center">
                    <h1 className="h3 mb-3 font-weight-normal">Sign In</h1>
                  </div>
                  {this.renderInputWithoutLabel(
                    "email",
                    "Email",
                    "email",
                    "Enter Email"
                  )}
                  {this.renderInputWithoutLabel(
                    "password",
                    "Password",
                    "password",
                    "Enter Password"
                  )}
                  <div className="text-right">
                    <a href=".">Forget Password?</a>
                  </div>
                  {this.renderCustomButton(
                    "Sign In",
                    "btn btn-lg btn-primary btn-block mt-3",
                    isSpinner
                  )}
                </form>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="col-8 offset-2">
                <Register />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AuthenticationForm;
