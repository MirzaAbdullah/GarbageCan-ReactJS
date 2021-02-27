import React from "react";
import Joi from "joi-browser";
import Form from "./common/Form";
import authService from "../services/authService";
import { toast } from "react-toastify";

class ChangePassword extends Form {
  state = {
    data: { oldPassword: "", newPassword: "", reEnterNewPassword: "" },
    errors: {},
    isSpinner: false,
    currentUser: authService.getCurrentUser(),
  };

  schema = {
    oldPassword: Joi.string().required().label("Old Password"),
    newPassword: Joi.string().required().label("New Password"),
    reEnterNewPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .label("Re-Enter New Password")
      .options({ language: { any: { allowOnly: "must match password" } } }),
  };

  isSpinnerActive = (isSpinner) => {
    this.setState({ isSpinner: isSpinner });
  };

  clearForm() {
    this.setState({
      data: { oldPassword: "", newPassword: "", reEnterNewPassword: "" },
    });
  }

  async isPasswordValid(userId, oldPassword) {
    return await authService.isPasswordValid(userId, oldPassword);
  }

  doSubmit_ChangePasswordForm = async () => {
    try {
      //Activate the button Spinner
      this.isSpinnerActive(true);

      const { data, currentUser } = this.state;

      //Check Old Password
      const { data: isPasswordValid } = await this.isPasswordValid(
        currentUser.userId,
        data.oldPassword
      );

      if (isPasswordValid) {
        this.setState({
          errors: {
            oldPassword: "Password doesn't matches with the saved one.",
          },
        });
      }

      if (Object.entries(this.state.errors).length === 0) {
        const { data: flag } = await authService.changePassword(
          currentUser.userId,
          data.newPassword
        );

        //display toaster
        flag
          ? toast.success("Password Changed Successfully")
          : toast.error("Password isn't Changed. Please try again");

        //Clear fields
        this.clearForm();
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

    return (
      <React.Fragment>
        <div className="col-12 mt-2 p-0">
          <div className="row mt-2">
            <div className="col-12 col-sm-12 col-md-12">
              <h4>
                <i className="fas fa-key"></i>&nbsp;Change Password
              </h4>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <form onSubmit={this.handleSubmit_ChangePasswordForm}>
                {this.renderInput(
                  "oldPassword",
                  "Old Password",
                  "password",
                  "Enter Old Password"
                )}
                {this.renderInput(
                  "newPassword",
                  "New Password",
                  "password",
                  "Enter New Password"
                )}
                {this.renderInput(
                  "reEnterNewPassword",
                  "Re-Enter New Password",
                  "password",
                  "Re-Enter New Password"
                )}
                {this.renderCustomButton(
                  "Change Password",
                  "btn btn-lg btn-primary btn-block mt-3",
                  isSpinner
                )}
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ChangePassword;
