import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import { toast } from "react-toastify";

//Services
import {
  getCurrentUser,
  isUserEmailExists,
  forgetPassword,
} from "../../services/authService";

class ForgetPassword extends Form {
  state = {
    data: {
      email: "",
    },
    errors: {},
    currentUser: getCurrentUser(),
    isSpinner: false,
  };

  schema = {
    email: Joi.string().required().label("Email"),
  };

  async isEmailExists(email) {
    return await isUserEmailExists(email);
  }

  isSpinnerActive = (isSpinner) => {
    this.setState({ isSpinner: isSpinner });
  };

  resetControls = () => {
    this.setState({
      data: {
        email: "",
      },
    });
  };

  doSubmit_ForgetPasswordForm = async () => {
    try {
      //Activate the button Spinner
      this.isSpinnerActive(true);

      const { data: userModel } = this.state;

      //Check if Email Already Exists
      const { data: isEmailExists } = await this.isEmailExists(userModel.email);

      //Setting Error state for Register Component when username & email already exists
      if (!isEmailExists) {
        this.setState({
          errors: {
            email: "Entered email doesn't exists in our system!",
          },
        });
      }

      if (Object.entries(this.state.errors).length === 0) {
        const { data: isNewPasswordSent } = await forgetPassword(
          userModel.email
        );

        if (isNewPasswordSent) {
          //reset Controls
          this.resetControls();

          toast.success("New password send to your registered email address");
        } else {
          toast.error("Sending new password failed! Please try again.");
        }
      }

      //Activate the button Spinner
      this.isSpinnerActive(false);
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
    const { handleModes } = this.props;

    return (
      <form onSubmit={this.handleSubmit_ForgetPasswordForm}>
        <div className="text-center mb-3">
          <h6 className="h5">Welcome to GarbageCAN (Pvt.) Ltd</h6>
          <span>
            Recover password or{" "}
            <a href="#/" onClick={() => handleModes("login")}>
              back to Sign-In
            </a>
          </span>
        </div>
        <div className="mb-2">
          {this.renderInputWithoutLabel(
            "email",
            "Registered Email",
            "email",
            "Enter Registered Email"
          )}
        </div>
        {this.renderCustomButton(
          "Forget Password",
          "btn btn-lg btn-primary btn-block mt-3",
          isSpinner
        )}
      </form>
    );
  }
}

export default ForgetPassword;
