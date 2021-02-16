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
    isRegisterView: false,
    isLoginView: false,
    currentUser: authService.getCurrentUser(),
  };

  schema = {
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  componentDidMount() {
    //Set isLoginView = true & isRegisterView = false
    this.setState({ isLoginView: true, isRegisterView: false });
  }

  isSpinnerActive = (isSpinner) => {
    this.setState({ isSpinner: isSpinner });
  };

  handleModes = (mode) => {
    if (mode === "login") {
      //Set isGridView = true & isEditView = false
      this.setState({ isLoginView: true, isRegisterView: false });
    } else if (mode === "register") {
      //Set isGridView = true & isEditView = false
      this.setState({ isLoginView: false, isRegisterView: true });
    }
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
    const { isSpinner, currentUser, isLoginView, isRegisterView } = this.state;

    if (currentUser) return <Redirect to="/dashboard" />;

    return (
      <Fragment>
        <div className="text-center Loginform_MT">
          <img
            className="mb-2"
            src="/GarbageCan_Logo.png"
            alt="GarbageCan Offical Logo"
            width="250"
            height="90"
          />
        </div>
        <div className="container mt-4">
          <div className="row">
            {isLoginView && (
              <div className="col-12 col-md-12">
                <div className="col-12 col-sm-12 col-md-4 offset-md-4">
                  <form onSubmit={this.handleSubmit_LoginForm}>
                    <div className="text-center mb-3">
                      <h6 className="h5">Welcome to GarbageCAN (Pvt.) Ltd</h6>
                      <span>
                        Please sign in below or{" "}
                        <a
                          href="javascript:void(0)"
                          onClick={() => this.handleModes("register")}
                        >
                          create an account
                        </a>
                      </span>
                    </div>
                    <div className="mb-2">
                      {this.renderInputWithoutLabel(
                        "email",
                        "Email",
                        "email",
                        "Enter Email"
                      )}
                    </div>
                    <div className="mb-2">
                      {this.renderInputWithoutLabel(
                        "password",
                        "Password",
                        "password",
                        "Enter Password"
                      )}
                    </div>
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
            )}
            {isRegisterView && (
              <div className="col-12 col-md-12">
                <div className="col-8 offset-2">
                  <Register handleModes={this.handleModes} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AuthenticationForm;
