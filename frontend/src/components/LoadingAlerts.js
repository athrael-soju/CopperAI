import React from "react";
import { Spin, Typography } from "antd";

const { Title } = Typography;

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
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
            }}
          >
            {alert?.message}
          </Title>
          {alert?.type !== "success" && <Spin size="large" />}
        </div>
        <Title
          level={2}
          size="large"
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          {alert?.description}
        </Title>
      </>
    );
  }

  return null;
};

export default LoadingAlerts;
