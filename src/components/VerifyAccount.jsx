import React from "react";
import Form from "./common/Form";
import Joi from "joi-browser";
import { toast } from "react-toastify";

import {
  getCurrentUser,
  verifyUser,
  sendVerificationCode,
} from "../services/authService";

class VerifyAccount extends Form {
  state = {
    data: {
      verificationCode: "",
    },
    errors: {},
    isSpinner: false,
    isTextBoxDisabled: "disabled",
    currentUser: getCurrentUser(),
    isProfileVerified: false,
  };

  schema = {
    verificationCode: Joi.string().required().label("Verification Code"),
  };

  componentDidMount() {}

  isSpinnerActive = (isSpinner) => {
    this.setState({ isSpinner: isSpinner });
  };

  resetControls = () => {
    this.setState({
      data: {
        verificationCode: "",
      },
    });
  };

  doSend_VerificationCode = async () => {
    try {
      //Activate spinner
      this.isSpinnerActive(true);

      const { currentUser } = this.state;
      const { email } = currentUser;
      const { data: isCodeSent } = await sendVerificationCode(email);

      if (isCodeSent) {
        //Activate the TextBox
        this.setState({ isTextBoxDisabled: "" });

        toast.success("Verification code send to your registered email.");
      } else {
        toast.error("Sending verification code failed! Please try again.");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.verificationCode = ex.response.data;
        this.setState({ errors });
      }
    }

    //Stop spinner
    this.isSpinnerActive(false);
  };

  doSubmit_VerifyAccountForm = async () => {
    try {
      //Activate the button Spinner
      this.isSpinnerActive(true);

      const { data: userModel } = this.state;
      const { email } = getCurrentUser();

      const { data: isVerified } = await verifyUser(
        email,
        userModel.verificationCode
      );

      if (isVerified) {
        //Reset the fields
        this.resetControls();

        //Setting the profile as valid
        this.setState({ isProfileVerified: true });

        toast.success("Account is Verified Successfully.");
      } else {
        toast.error("Account isn't verified! Please try again.");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.verificationCode = ex.response.data;
        this.setState({ errors });
      }
    }

    //Activate the button Spinner
    this.isSpinnerActive(false);
  };

  render() {
    const {
      isSpinner,
      currentUser,
      data,
      isTextBoxDisabled,
      isProfileVerified,
    } = this.state;

    if (currentUser.isVerified === "True" || isProfileVerified) {
      return (
        <div className="text-center mt-5">
          <span className="text-success">
            <i className="fas fa-certificate"></i> Your Account is Verified
          </span>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className="row mt-2">
          <div className="col-12 col-sm-12 col-md-6">
            <h4>
              <i className="fas fa-certificate"></i> Verify Account
            </h4>
          </div>
          <div className="col-12 col-sm-12 col-md-6 text-right">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => this.doSend_VerificationCode()}
            >
              {isSpinner && data.verificationCode === "" && (
                <React.Fragment>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  &nbsp;Sending Verification Code...
                </React.Fragment>
              )}
              {(isSpinner === false || data.verificationCode !== "") && (
                <React.Fragment>
                  <i className="far fa-paper-plane"></i>&nbsp;Send Verification
                  Code
                </React.Fragment>
              )}
            </button>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-12 mt-2 mb-2 p-0">
          <form onSubmit={this.handleSubmit_VerifyAccountForm}>
            {this.renderInputDisable(
              "verificationCode",
              "Verification Code",
              "number",
              "Enter Verification Code",
              isTextBoxDisabled
            )}
            {this.renderCustomButton(
              "Verify",
              "btn btn-lg btn-primary btn-block mt-3",
              isSpinner && data.verificationCode !== ""
            )}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default VerifyAccount;
