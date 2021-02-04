import React from "react";
import "./StepsHeader.scss";

function StepsHeader(props) {
  return (
    <div className="steps-bar">
      <div className={`step ${props.activeStep === 1 && "active-step"}`}>
        <h2>STEP 1</h2>
      </div>
      <div className={`step ${props.activeStep === 2 && "active-step"}`}>
        <h2>STEP 2</h2>
      </div>
      <div className={`step ${props.activeStep === 3 && "active-step"}`}>
        <h2>STEP 3</h2>
      </div>
    </div>
  );
}

export default StepsHeader;
