import React, { Component } from "react";

class ModalConfirmation extends Component {
  render() {
    const {
      modalHeader,
      modalBody,
      modalButtonText,
      modalKey,
      modalButtonOperation,
    } = this.props;

    return (
      <React.Fragment>
        <div
          className="modal fade garbageCanModal"
          id="garbageCanModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="garbageCanModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="garbageCanModalLabel">
                  {modalHeader}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="text-center">{modalBody}</div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => modalButtonOperation(modalKey)}
                >
                  {modalButtonText}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ModalConfirmation;
