import React from "react";
import "./StepsHeader.scss";

function StepsHeader(props) {
  return (
    <div className="steps-bar">
      <h1>Scanify</h1>
      {props.user && <p>Signed in to Spotify as <strong>{props.user.display_name}</strong></p>}
    </div>
  );
}

export default StepsHeader;
