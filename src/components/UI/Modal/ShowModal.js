import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ShowModal extends Component {
  shouldComponentUpdate(nextProps, prevProps) {
    return nextProps.modal !== this.props.modal;
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.modal}
          toggle={this.props.toggle}
          className=""
        >
          <ModalHeader toggle={this.props.toggle}>
            {this.props.title}
          </ModalHeader>
          <ModalBody>{this.props.children}</ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ShowModal;
