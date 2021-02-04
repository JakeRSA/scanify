import React from "react";
import StepsHeader from "../StepsHeader/StepsHeader";
import "./StepScreen.scss";
import spotifyIcon from "../../spotify.png";
import loadIcon from "../../load.png";
import runIcon from "../../run.png";

function StepScreen(props) {
  let icon, heading, subHeading;
  switch (props.step) {
    case 1:
      icon = spotifyIcon;
      heading = "SIGN IN TO SPOTIFY";
      subHeading="We need permission to add songs to your Spotify library"
      break;
    case 2:
      icon = loadIcon;
      heading = "SELECT FOLDER"
      subHeading = "Select a folder to upload to Spotify"
      break;
    case 3:
      icon = runIcon;
      heading = "RUN SEARCH";
      subHeading = "Let's find your songs on Spotify"
      break;
    default:
      icon=spotifyIcon;
  }

  return (
    <div>
      <StepsHeader activeStep={props.step} />
      <div className="main-container">
        <img
          className="main-step-btn"
          alt={"sign in to spotify"}
          src={icon}
          onClick={() => {props.getSpotifyAuth()}}
        />
        <h1 className="btn-action-text">{heading}</h1>
        <h4 className="btn-action-subtext">
          {subHeading}
        </h4>
      </div>
    </div>
  );
}

export default StepScreen;
