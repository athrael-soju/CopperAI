import React from "react";
import { Modal } from "react-bootstrap";

const AccountModal = ({ show, handleClose, children }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default AccountModal;
