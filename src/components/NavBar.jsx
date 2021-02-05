import React from "react";
import { NavLink, Link } from "react-router-dom";

const NavBar = ({ user }) => {
  if (user == null) {
    document.body.classList.add("Loginform_Background");
    return false;
  } else {
    document.body.classList.remove("Loginform_Background");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
      <Link className="navbar-brand" to="/">
        <i className="fas fa-recycle"></i>&nbsp;&nbsp;GarbageCan
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {user && (
            <React.Fragment>
              <li className="nav-item">
                <NavLink className="nav-link" to="/approve">
                  <i className="fas fa-check-circle"></i>&nbsp; Approve Mosques
                </NavLink>
              </li>
            </React.Fragment>
          )}
        </ul>
        <ul className="navbar-nav">
          {user && (
            <React.Fragment>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  {user.email}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/logout">
                  Logout
                </NavLink>
              </li>
            </React.Fragment>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
