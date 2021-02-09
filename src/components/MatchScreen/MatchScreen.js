import React, { useState, useEffect } from "react";
import Match from "../Match/Match";
import "./MatchScreen.scss";

function MatchScreen(props) {
  const [step, setStep] = useState("exact");
  const [exactMatches, setExactMatches] = useState([]);
  const [partialMatches, setPartialMatches] = useState([]);
  const [noMatches, setNoMatches] = useState([]);
  const [analysisText, setAnalysisText] = useState("");

  // on mount set state of matches
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
    if (tempExactMatches.length === 0) {
      setAnalysisText(
        `We couldn't find any exact matches. Click next to see partial matches`
      );
    } else {
      setAnalysisText(
        `We found ${tempExactMatches.length} exact matches. Select which ones you'd like to add to your Liked Songs on Spotify`
      );
    }
  }, []);

  const handleNextClick = () => {
    if (step === "exact") {
      setStep("partial");
    } else if (step === "partial") {
      setStep("no match");
    }
  };

  // render different text based on step
  useEffect(() => {
    if (step === "partial") {
      if (partialMatches.length === 0) {
        setAnalysisText(
          `We didn't get any partial matches. Click next to see what we couldn't find on Spotify`
        );
      } else {
        setAnalysisText(
          `We found ${partialMatches.length} partial matches. Select which ones you'd like to add to your Liked Songs on Spotify`
        );
      }
    } else if (step === "no match") {
      if (noMatches.length === 0) {
        setAnalysisText(
          `This is usually where we show you what we could not find on Spotify. This time, we found everything!`
        );
      } else {
        setAnalysisText(
          `We couldn't find a match for ${noMatches.length} tracks`
        );
      }
    }
  }, [step]);

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
      {(step === "exact" || step === "partial") && (
        <span className="grid-headers">
          <h3>Track in local library</h3>
          <h3>Track on Spotify</h3>
          <h4>Add to Spotify</h4>
        </span>
      )}

      <div className="match-grid">
        {step === "exact" && exactMatchElems}
        {step === "partial" && partialMatchElems}
      </div>
      <button className="next-match-grid-btn" onClick={handleNextClick}>
        next
      </button>
    </div>
  );
}

export default MatchScreen;
