import React from "react";
import { Modal } from "antd";

const AccountModal = ({ show, handleClose, children }) => {
  return (
    <Modal
      centered
      title="Account"
      okText="Login"
      open={show}
      onCancel={handleClose}
      closable
      footer={null}
      width={600}
    >
      {children}
    </Modal>
  );
};

export default AccountModal;
