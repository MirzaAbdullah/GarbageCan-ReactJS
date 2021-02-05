import { Component } from "react";
import authService from "../services/authService";

class Logout extends Component {
  componentDidMount() {
    //Logout user
    authService.logout();
    //Redirects to homePage
    window.location = "/";
  }

  render() {
    return null;
  }
}

export default Logout;
