import React from "react";
import Match from "../Match/Match";
import "./MatchScreen.scss";

function MatchScreen(props) {
  console.log(props.songs[0]);
  return (
    <div className="results-container">
      <div className="match-grid">
        {props.songs[0].spotify && (
          <Match
            song={props.songs[0]}
            toggleAddToLib={(songId) => {
              props.toggleAddToLib(songId);
            }}
          />
        )}
        {props.songs[0].spotify && (
          <Match
            song={props.songs[1]}
            toggleAddToLib={(songId) => {
              props.toggleAddToLib(songId);
            }}
          />
        )}
        {props.songs[0].spotify && (
          <Match
            song={props.songs[2]}
            toggleAddToLib={(songId) => {
              props.toggleAddToLib(songId);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default MatchScreen;
