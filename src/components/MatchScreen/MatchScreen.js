import React, { useState, useEffect } from "react";
import Match from "../Match/Match";
import "./MatchScreen.scss";

function MatchScreen(props) {
  const [step, setStep] = useState("exact");
  const [exactMatches, setExactMatches] = useState([]);
  const [partialMatches, setPartialMatches] = useState([]);
  const [noMatches, setNoMatches] = useState([]);
  const [analysisText, setAnalysisText] = useState("")

  useEffect(() => {
    const songs = props.songs;
    let tempExactMatches = [];
    let tempPartialMatches = [];
    let tempNoMatches = [];
    for (let song of songs) {
      if (Array.isArray(song.spotify)) {
        if (song.spotify.length > 0) {
          tempPartialMatches.push(song);
        } else {
          tempNoMatches.push(song);
        }
      } else {
        tempExactMatches.push(song);
      }
    }
    setExactMatches(tempExactMatches);
    setPartialMatches(tempPartialMatches);
    setNoMatches(tempNoMatches);
    if (!tempExactMatches) {
      if (!partialMatches) {
        setStep("no match");
      } else {
        setStep("partial");
      }
    } else {
      setAnalysisText(`We found ${exactMatches.length} exact matches. Select which ones you'd like to add to your Liked Songs on Spotify`);
    }
  }, []);

  const exactMatchElems = exactMatches.map((match) => (
    <Match
      key={match.id}
      song={match}
      toggleAddToLib={(songId) => {
        props.toggleAddToLib(songId);
      }}
    />
  ));

  const partialMatchElems = partialMatches.map((match) => (
    <Match
      key={match.id}
      song={match}
      toggleAddToLib={(songId) => {
        props.toggleAddToLib(songId);
      }}
    />
  ));

  return (
    <div className="results-container">
      <span className="results-analysis">
        <p>{analysisText}</p>
      </span>
      <span className="grid-headers">
        <h3>Track in local library</h3>
        <h3>Track on Spotify</h3>
        <h4>Add to Spotify</h4>
      </span>
      <div className="match-grid">{exactMatchElems}</div>
      <button className="next-match-grid-btn">next</button>
    </div>
  );
}

export default MatchScreen;
