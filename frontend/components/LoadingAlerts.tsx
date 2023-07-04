import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoadingAlerts = ({ alert }: any) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100px',
        }}
      >
        <Title
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
          }}
        >
          {alert?.message}
        </Title>
        {alert?.message && alert?.type !== 'success' && (
          <Spin
            size="large"
            indicator={
              <LoadingOutlined style={{ fontSize: 54, color: '#fff' }} spin />
            }
          />
        )}
      </div>
      <Title
        level={2}
        style={{
          color: 'white',
          textAlign: 'center',
        }}
      >
        {alert?.description}
      </Title>
    </>
  );
};

export default LoadingAlerts;
