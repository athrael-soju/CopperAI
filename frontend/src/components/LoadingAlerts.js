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
        message={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {alert?.message}
            {alert?.type !== "success" && <Spin size="large" />}
          </div>
        }
        type={alert.type}
        description={alert?.description}
        style={{
          width: "100%",
          padding: "1rem",
        }}
      >
        <Spin size="large" />
      </Alert>
    );
  }

  return null;
};

export default LoadingAlerts;
