import React from 'react';
import { ColorRing, Dna } from 'react-loader-spinner';

const Spinner = () => {
  return (
    <div className="spinner-container">
      <ColorRing
        visible={true}
        height="800"
        width="800"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#866a67', '#9a9385', '#c5bfa7', '#e6dbc8', '#4e5560']}
      />
    </div>
  );
};

export default Spinner;
