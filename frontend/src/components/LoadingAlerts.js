import React from "react";
import { Spin, Alert } from "antd";

const LoadingAlerts = ({ loading, alert }) => {
  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          margin: "auto",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (alert) {
    return (
      <Alert
        message={alert.message}
        type={alert.type}
        description={alert?.description}
        style={{
          width: "100%",
          padding: "1rem",
        }}
      />
    );
  }

  return null;
};

export default LoadingAlerts;
