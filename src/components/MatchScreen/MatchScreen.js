import React from "react";
import Match from "../Match/Match";
import "./MatchScreen.scss";

function MatchScreen(props) {
  console.log(props.songs[0]);
  return (
    <div className="results-container">
      <div className="match-grid">
        {props.songs[0].spotifyMatches && (
          <Match
            song={props.songs[0]}
            toggleAddtoLib={() => {
              props.toggleAddtoLib();
            }}
          />
        )}
        {props.songs[0].spotifyMatches && (
          <Match
            song={props.songs[1]}
            toggleAddtoLib={() => {
              props.toggleAddtoLib();
            }}
          />
        )}
        {props.songs[0].spotifyMatches && (
          <Match
            song={props.songs[2]}
            toggleAddtoLib={() => {
              props.toggleAddtoLib();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default MatchScreen;
