import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import AuthenticationForm from "./components/AuthenticationForm";
import Logout from "./components/Logout";
import Approve from "./components/Approve";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import authService from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = authService.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/logout" component={Logout} />
            <Route path="/authentication" component={AuthenticationForm} />
            <Route path="/dashboard" component={Dashboard} />
            <ProtectedRoute path="/Approve" component={Approve} />
            <Route path="/not-found" component={NotFound}></Route>
            <Redirect exact from="/" to="authentication" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
