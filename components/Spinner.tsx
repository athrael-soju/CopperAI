import React from 'react';
import { ColorRing } from 'react-loader-spinner';

const Spinner = () => {
  return (
    <div
      className="spinner-container"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <ColorRing
        visible={true}
        height={300}
        width={300}
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#866a67', '#9a9385', '#c5bfa7', '#e6dbc8', '#4e5560']}
      />
    </div>
  );
};

export default Spinner;
