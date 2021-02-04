import React from "react";
import StepsHeader from "../StepsHeader/StepsHeader";
import "./StepScreen.scss";
import spotifyIcon from "../../spotify.png";
import loadIcon from "../../load.png";
import runIcon from "../../run.png";

function StepScreen() {
  return (
    <div>
      <StepsHeader activeStep={1} />
      <div className="main-container">
          <img className="main-step-btn" alt={"sign in to spotify"} src={spotifyIcon} />
        <h1 className="btn-action-text">SIGN IN TO SPOTIFY</h1>
        <h4 className="btn-action-subtext">
          We need permission to add to your Spotify library
        </h4>
      </div>
    </div>
  );
}

export default StepScreen;
