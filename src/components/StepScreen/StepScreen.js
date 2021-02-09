import React from "react";
import StepsHeader from "../StepsHeader/StepsHeader";
import "./StepScreen.scss";
import spotifyIcon from "../../spotify.png";
import loadIcon from "../../load.png";
import runIcon from "../../run.png";
import { useState, useEffect, useRef } from "react";
import * as id3 from "id3js/lib/id3.js";
import getBlobDuration from "get-blob-duration";
import LocalSong from "../../LocalSong";

function StepScreen(props) {
  const [loadingFiles, setLoadingFiles] = useState(false);
  const inputElem = useRef(document.querySelector("input"));
  const [icon, setIcon] = useState(undefined);
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");

  useEffect(() => {
    const step = props.step;
    if (step === 1) {
      setIcon(spotifyIcon);
      setHeading("SIGN IN TO SPOTIFY");
      setSubHeading("We need permission to add songs to your Spotify library");
    } else if (step === 2) {
      setIcon(loadIcon);
      setHeading("SELECT FOLDER");
      setSubHeading("Select a folder to upload to Spotify");
    } else {
      setIcon(runIcon);
      setHeading("RUN SEARCH");
      setSubHeading(
        `Found ${props.localSongs.length} file(s). Let's find your songs on Spotify`
      );
    }
  }, [props.step]);

  useEffect(() => {
    if (inputElem.current) {
      inputElem.current.setAttribute("webkitdirectory", true);
      inputElem.current.setAttribute("multiple", true);
    }
  });

  const addFolder = async () => {
    setLoadingFiles(true);
    let songs = [];
    const fileList = inputElem.current.files;
    if (fileList.length !== 0) {
      for (let file of fileList) {
        const tags = await id3.fromFile(file);
        if (tags) {
          const objectUrl = URL.createObjectURL(file);
          const duration = await getBlobDuration(objectUrl);
          URL.revokeObjectURL(objectUrl);
          const localSong = new LocalSong(
            tags.title,
            tags.artist,
            tags.album,
            duration
          );
          songs.push(localSong);
        }
      }
    }
    setLoadingFiles(false);
    if (songs && songs.length > 0) {
      props.getFiles(songs);
    } else if (songs) {
      setSubHeading(
        "Could not find any files. Make sure the folder contains .mp3 files"
      );
    }
  };
  return (
    <div>
      <StepsHeader activeStep={props.step} />
      <div className="main-container">
        {props.step === 1 && (
          <img
            className="main-step-btn"
            alt={"sign in to spotify"}
            src={icon}
            onClick={() => {
              props.getSpotifyAuth();
            }}
          />
        )}
        {props.step === 2 && (
          <label htmlFor="fileUpload">
            <img
              className="main-step-btn"
              alt={"add folder from local library"}
              src={icon}
              onClick={addFolder}
            />
            <input
              type="file"
              id="fileUpload"
              ref={inputElem}
              onChange={() => {
                addFolder();
              }}
              style={{ display: "none" }}
            />
          </label>
        )}
        {props.step === 3 && (
          <img
            className="main-step-btn"
            alt={"run search"}
            src={icon}
            onClick={async () => {
              await props.runSearch();
            }}
          />
        )}
        <h1 className="btn-action-text">{heading}</h1>
        <h4 className="btn-action-subtext">{subHeading}</h4>
      </div>
    </div>
  );
}

export default StepScreen;
