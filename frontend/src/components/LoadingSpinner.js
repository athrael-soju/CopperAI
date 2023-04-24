import React from "react";
import "../styles/LoadingSpinner.css";
import { Dna } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <Dna
        visible={true}
        height="700"
        width="700"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="spinner-wrapper"
      />
    </div>
  );
};

export default Spinner;
