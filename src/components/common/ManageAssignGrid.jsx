import React, { Component } from "react";
import $ from "jquery";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@material-ui/core";

import ModalConfirmation from "./ModalConfirmation";

class ManageAssignGrid extends Component {
  useRowStyles = makeStyles({
    root: {
      "& > *": {
        borderBottom: "unset",
      },
    },
  });

  state = {
    open: false,
    openId: "",
    selectedKey: "",
    allAssignPickupData: this.props.allAssignPickupData,
  };

  handleSetOpen = (driverId) => {
    this.setState({ open: !this.state.open, openId: driverId });
  };

  handleDateFormat = (date) => {
    return `${new Date(date).toLocaleDateString("de-DE")}`;
  };

  updateSelectedKey = (key) => {
    this.setState({
      selectedKey: key,
    });
  };

  handleDeletePickup = (assignId) => {
    console.log("delete", assignId);
  };

  render() {
    const { open, openId, selectedKey, allAssignPickupData } = this.state;

    return (
      <React.Fragment>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell className="font-weight-bold">Driver</TableCell>
                <TableCell className="font-weight-bold">Email</TableCell>
                <TableCell className="font-weight-bold">Phone No</TableCell>
                <TableCell className="font-weight-bold">
                  Total Pickups
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allAssignPickupData.map((pickup) => (
                <React.Fragment key={pickup.driverId}>
                  <TableRow
                    key={pickup.driverId}
                    className={this.useRowStyles.root}
                  >
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => this.handleSetOpen(pickup.driverId)}
                      >
                        <i
                          className={`fas ${
                            openId === pickup.driverId
                              ? open
                                ? "fa-angle-up"
                                : "fa-angle-down"
                              : "fa-angle-down"
                          }`}
                        ></i>
                      </IconButton>
                    </TableCell>
                    <TableCell>{pickup.driverName}</TableCell>
                    <TableCell>{pickup.driverEmail}</TableCell>
                    <TableCell>{pickup.driverPhoneNo}</TableCell>
                    <TableCell align="center">
                      {pickup.requestDetails.length}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={7}
                    >
                      <Collapse
                        in={openId === pickup.driverId ? open : false}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Assign Pickup's Details
                          </Typography>
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableRow>
                                <TableCell className="font-weight-bold">
                                  Pickup Date
                                </TableCell>
                                <TableCell className="font-weight-bold">
                                  Pickup Time
                                </TableCell>
                                <TableCell className="font-weight-bold">
                                  Pickup Address
                                </TableCell>
                                <TableCell />
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pickup.requestDetails.length === 0 && (
                                <TableRow>
                                  <TableCell
                                    style={{ opacity: 0.7 }}
                                    colSpan="4"
                                    className="text-center"
                                  >
                                    <span>There are no assigned pickups.</span>
                                  </TableCell>
                                </TableRow>
                              )}
                              {pickup.requestDetails.length > 0 &&
                                pickup.requestDetails
                                  .sort(
                                    (a, b) =>
                                      new Date(a.pickupDate) -
                                      new Date(b.pickupDate)
                                  )
                                  .map((requestDetail) => (
                                    <TableRow key={requestDetail.assignId}>
                                      <TableCell component="th" scope="row">
                                        {this.handleDateFormat(
                                          requestDetail.pickupDate
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {requestDetail.pickupTime}
                                      </TableCell>
                                      <TableCell>
                                        {requestDetail.address}
                                      </TableCell>
                                      <TableCell>
                                        <a
                                          data-toggle="modal"
                                          data-target="#garbageCanModal"
                                          href="/#"
                                          className="text-danger ml-1"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <i className="far fa-2x fa-trash-alt"></i>
                                        </a>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ModalConfirmation
          modalHeader="Delete Pickup"
          modalBody="Are you sure want to delete this pickup ?"
          modalButtonText="Delete Pickup"
          modalKey={selectedKey}
          modalButtonOperation={this.handleDeletePickup}
        ></ModalConfirmation>
      </React.Fragment>
    );
  }
}

export default ManageAssignGrid;
