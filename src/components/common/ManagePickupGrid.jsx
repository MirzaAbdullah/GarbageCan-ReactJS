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
import { deletePickupRequest } from "../../services/pickupService";

class ManagePickupGrid extends Component {
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
    allPickupsData: this.props.allPickupsData,
  };

  handleSetOpen = (requestId) => {
    this.setState({ open: !this.state.open, openId: requestId });
  };

  handleDateFormat = (date) => {
    return `${new Date(date).toLocaleDateString("de-DE")}`;
  };

  handleSubTotal = (array, key) => {
    return array.reduce((acc, curr) => (acc = acc + curr[key]), 0);
  };

  updateSelectedKey = (key) => {
    this.setState({
      selectedKey: key,
    });
  };

  handleStatusBadge = (status) => {
    let badgeClass;

    switch (status) {
      case "Completed":
        badgeClass = "badge-success";
        break;
      case "AssignedToDriver":
        badgeClass = "badge-secondary";
        break;
      case "OutForPickup":
        badgeClass = "badge-warning";
        break;
      default:
        //this case is for InProcess
        badgeClass = "badge-primary";
        break;
    }

    return badgeClass;
  };

  handleDeletePickup = async (pickupId) => {
    const { data } = await deletePickupRequest(pickupId);

    if (data === true) {
      const { allPickupsData } = this.state;

      let cloneAllPickups = allPickupsData.filter(
        (item) => item.idRequest !== pickupId
      );

      //update state
      this.setState({ allPickupsData: cloneAllPickups });

      //Hide modal
      $(".garbageCanModal").modal("hide");

      //display toaster
      toast.success("Pickup request delete successfully");
    } else {
      toast.error(
        "Deleting pickup request failed Or it's only possible to delete if pickup status is In Process! Please try again. "
      );
    }
  };

  render() {
    const { open, openId, selectedKey, allPickupsData } = this.state;

    return (
      <React.Fragment>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell className="font-weight-bold">Pickup Date</TableCell>
                <TableCell className="font-weight-bold">Pickup Time</TableCell>
                <TableCell className="font-weight-bold" align="right">
                  Total Price (PKR)
                </TableCell>
                <TableCell className="font-weight-bold">
                  Requested Date
                </TableCell>
                <TableCell className="font-weight-bold">
                  Pickup Status
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {allPickupsData.map((pickup) => (
                <React.Fragment key={pickup.idRequest}>
                  <TableRow
                    key={pickup.idRequest}
                    className={this.useRowStyles.root}
                  >
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => this.handleSetOpen(pickup.idRequest)}
                      >
                        <i
                          className={`fas ${
                            openId === pickup.idRequest
                              ? open
                                ? "fa-angle-up"
                                : "fa-angle-down"
                              : "fa-angle-down"
                          }`}
                        ></i>
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {this.handleDateFormat(pickup.pickupDate)}
                    </TableCell>
                    <TableCell>{pickup.pickupTime}</TableCell>
                    <TableCell align="right">
                      {this.handleSubTotal(pickup.requestDetails, "itemCost") -
                        pickup.pickup_Cost}
                    </TableCell>
                    <TableCell>
                      {this.handleDateFormat(pickup.createdDate)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`badge ${this.handleStatusBadge(
                          pickup.pickupStatus
                        )}`}
                      >
                        {pickup.pickupStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a
                        onClick={() => this.updateSelectedKey(pickup.idRequest)}
                        data-toggle="modal"
                        data-target="#garbageCanModal"
                        href="/#"
                        className={`text-danger ml-1 ${
                          pickup.pickupStatus !== "InProcess"
                            ? "anchorDisabled"
                            : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="far fa-2x fa-trash-alt"></i>
                      </a>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={7}
                    >
                      <Collapse
                        in={openId === pickup.idRequest ? open : false}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Pickup Details
                          </Typography>
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableRow>
                                <TableCell className="font-weight-bold">
                                  Item Name
                                </TableCell>
                                <TableCell
                                  className="font-weight-bold"
                                  align="right"
                                >
                                  Item Weight (kg)
                                </TableCell>
                                <TableCell
                                  className="font-weight-bold"
                                  align="right"
                                >
                                  Item Cost (per kg)
                                </TableCell>
                                <TableCell
                                  className="font-weight-bold"
                                  align="right"
                                >
                                  Total (PKR)
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pickup.requestDetails.map((requestDetail) => (
                                <TableRow key={requestDetail.idRequestDetail}>
                                  <TableCell component="th" scope="row">
                                    {requestDetail.itemName}
                                  </TableCell>
                                  <TableCell align="right">
                                    {requestDetail.itemWeight}
                                  </TableCell>
                                  <TableCell align="right">
                                    {requestDetail.itemCost /
                                      requestDetail.itemWeight >=
                                    0
                                      ? requestDetail.itemCost /
                                        requestDetail.itemWeight
                                      : 0}
                                  </TableCell>
                                  <TableCell align="right">
                                    {requestDetail.itemCost}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow rowSpan={4}>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell
                                  align="right"
                                  className="font-weight-bold"
                                >
                                  Subtotal (PKR)
                                </TableCell>
                                <TableCell align="right">
                                  {this.handleSubTotal(
                                    pickup.requestDetails,
                                    "itemCost"
                                  )}
                                </TableCell>
                              </TableRow>
                              <TableRow rowSpan={4}>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell
                                  align="right"
                                  className="font-weight-bold"
                                >
                                  Shipping Cost (PKR)
                                </TableCell>
                                <TableCell align="right">
                                  {pickup.pickup_Cost}
                                </TableCell>
                              </TableRow>
                              <TableRow rowSpan={4}>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell
                                  align="right"
                                  className="font-weight-bold"
                                >
                                  Total (PKR)
                                </TableCell>
                                <TableCell align="right">
                                  {this.handleSubTotal(
                                    pickup.requestDetails,
                                    "itemCost"
                                  ) - pickup.pickup_Cost}
                                </TableCell>
                              </TableRow>
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

export default ManagePickupGrid;
