import React from "react";
import { Modal } from "antd";

const AccountModal = ({ show, handleClose, children }) => {
  return (
    <Modal
      title="Account"
      okText="Login"
      open={show}
      onCancel={handleClose}
      closable
    >
      {children}
    </Modal>
  );
};

export default AccountModal;
