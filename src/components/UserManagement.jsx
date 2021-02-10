import React, { Component } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import { getAllUsers, deactivateUserAccount } from "../services/userService";

class UserManagement extends Component {
  state = {
    allUsers: [],
  };

  useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  componentDidMount() {
    this.handleGetAllUsers();
  }

  handleGetAllUsers = async () => {
    const { data } = await getAllUsers();
    this.setState({ allUsers: data });
  };

  handleDateFormat = (date) => {
    return `${new Date(date).toLocaleDateString("de-DE")}`;
  };

  handleVerifiedIcon = (flag) => {
    if (flag) {
      return "fas fa-check-circle text-success";
    }
    return "fas fa-times-circle text-danger";
  };

  handleDeleteAccount = async (userId) => {
    const { data } = await deactivateUserAccount(userId);

    if (data === true) {
      const { allUsers } = this.state;

      //Change Bit from true to false
      const userIndex = allUsers.findIndex((user) => user.idUser);
      let cloneAllUsers = [...allUsers];

      cloneAllUsers[userIndex] = {
        ...cloneAllUsers[userIndex],
        isVerified: false,
      };

      //update state
      this.setState({ allUsers: cloneAllUsers });

      //display toaster
      toast.success("User Account Deactivated Successfully");
    } else {
      toast.error("Deactivating user account failed! Please try again. ");
    }
  };

  render() {
    const { allUsers } = this.state,
      cursorPointer = {
        cursor: "pointer",
      };

    if (allUsers.length === 0) {
      return <p className="mt-2">There are no registered users</p>;
    }

    return (
      <React.Fragment>
        <div className="row mt-2">
          <div className="col-6">
            <h4>User Management</h4>
          </div>
          <div className="col-6 text-right">
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Add User
            </button>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <TableContainer component={Paper}>
                <Table
                  className={this.useStyles.table}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">Name</TableCell>
                      <TableCell className="font-weight-bold">Email</TableCell>
                      <TableCell className="font-weight-bold">
                        Phone No
                      </TableCell>
                      <TableCell className="font-weight-bold">Role</TableCell>
                      <TableCell className="font-weight-bold">Date</TableCell>
                      <TableCell className="font-weight-bold">
                        Verified
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUsers
                      .sort(
                        (a, b) =>
                          new Date(b.createdDate) - new Date(a.createdDate)
                      )
                      .map((allUser) => (
                        <TableRow key={allUser.idUser}>
                          <TableCell component="th" scope="row">
                            {allUser.name}
                          </TableCell>
                          <TableCell>{allUser.email}</TableCell>
                          <TableCell>{allUser.phoneNo}</TableCell>
                          <TableCell>{allUser.nameRole}</TableCell>
                          <TableCell>
                            {this.handleDateFormat(allUser.createdDate)}
                          </TableCell>
                          <TableCell className="text-center">
                            <i
                              className={this.handleVerifiedIcon(
                                allUser.isVerified
                              )}
                            ></i>
                          </TableCell>
                          <TableCell>
                            <a
                              onClick={() =>
                                this.handleDeleteAccount(allUser.idUser)
                              }
                              className="text-danger ml-1"
                              style={cursorPointer}
                            >
                              <i className="far fa-2x fa-trash-alt"></i>
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserManagement;
