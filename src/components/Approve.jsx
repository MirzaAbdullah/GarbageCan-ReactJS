import React, { Component } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { toast } from "react-toastify";

import {
  getAllPendingAccounts,
  approveAccount,
  deleteAccount,
} from "../services/approveService";

class Approve extends Component {
  state = {
    pendingAccounts: [],
  };

  useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  componentDidMount() {
    this.handleGetAllPendingAccounts();
  }

  handleGetAllPendingAccounts = async () => {
    const { data } = await getAllPendingAccounts();
    this.setState({ pendingAccounts: data });
  };

  handleMasjidAddress = (masjidData) => {
    let completeAddress;
    masjidData.forEach((address) => {
      completeAddress = `${address.uamasjidAddress}, ${address.uamasjidZipCode}, ${address.uacity.cityName}`;
    });

    return completeAddress;
  };

  handleDateFormat = (date) => {
    return `${new Date(date).toLocaleDateString("de-DE")} ${new Date(
      date
    ).toLocaleTimeString("de-DE")}`;
  };

  handleApproveAccount = async (userId) => {
    const { data } = await approveAccount(userId);

    if (data === true) {
      let pendingAccounts = [...this.state.pendingAccounts];

      //remove from array
      pendingAccounts.splice(
        pendingAccounts.findIndex((item) => item.uid === userId),
        1
      );

      //update state
      this.setState({ pendingAccounts });

      //display toaster
      toast.success("Mosque Approved Successfully");
    } else {
      toast.error("Approving Mosque Failed. ");
    }
  };

  handleDeleteAccount = async (userId) => {
    const { data } = await deleteAccount(userId);

    if (data === true) {
      let pendingAccounts = [...this.state.pendingAccounts];

      //remove from array
      pendingAccounts.splice(
        pendingAccounts.findIndex((item) => item.uid === userId),
        1
      );

      //update state
      this.setState({ pendingAccounts });

      //display toaster
      toast.success("Mosque Deleted/Rejected Successfully");
    } else {
      toast.error("Approving/Rejecting Mosque Failed. ");
    }
  };

  render() {
    const { pendingAccounts } = this.state,
      cursorPointer = {
        cursor: "pointer",
      };

    if (pendingAccounts.length === 0) {
      return <p className="mt-2">There are no pending accounts</p>;
    }

    return (
      <React.Fragment>
        <h2>Approve Mosques</h2>
        <div className="row">
          <div className="col-12 mt-3">
            <TableContainer component={Paper}>
              <Table className={this.useStyles.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="font-weight-bold">Id</TableCell>
                    <TableCell className="font-weight-bold">
                      Masjid Name
                    </TableCell>
                    <TableCell className="font-weight-bold">Address</TableCell>
                    <TableCell className="font-weight-bold">
                      Created On
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingAccounts.map((pendingAccount) => (
                    <TableRow key={pendingAccount.uid}>
                      <TableCell component="th" scope="row">
                        {pendingAccount.uid}
                      </TableCell>
                      <TableCell>{pendingAccount.umasjidName}</TableCell>
                      <TableCell>
                        {this.handleMasjidAddress(pendingAccount.tblAddress)}
                      </TableCell>
                      <TableCell>
                        {this.handleDateFormat(pendingAccount.createdDate)}
                      </TableCell>
                      <TableCell>
                        <a
                          onClick={() =>
                            this.handleApproveAccount(pendingAccount.uid)
                          }
                          className="text-success mr-1"
                          style={cursorPointer}
                        >
                          <i className="far fa-2x fa-check-circle"></i>
                        </a>
                        <a
                          onClick={() =>
                            this.handleDeleteAccount(pendingAccount.uid)
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
      </React.Fragment>
    );
  }
}

export default Approve;
