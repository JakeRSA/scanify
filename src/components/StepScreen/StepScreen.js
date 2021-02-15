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
  const [searching, setSearching] = useState(false);
  const [currentFileCount, setCurrentFileCount] = useState(0);
  const [totalFileCount, setTotalFileCount] = useState(0);
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
        `Analysed ${props.localSongs.length} file(s). Let's find your songs on Spotify`
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
      setTotalFileCount(fileList.length);
      for (let i = 0; i < fileList.length; i++) {
        if (i% 10 === 0) setCurrentFileCount(i);
        const tags = await id3.fromFile(fileList[i]);
        if (tags) {
          const objectUrl = URL.createObjectURL(fileList[i]);
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
    setTotalFileCount(0);
    if (songs && songs.length > 0) {
      props.getFiles(songs);
    } else if (songs) {
      setSubHeading(
        "Could not find any files. Make sure the folder contains .mp3 files"
      );
    }
  };

  const handleClick = () => {
    if (props.step === 1) {
      props.getSpotifyAuth();
    } else if (props.step === 2) {
      addFolder();
    } else if (props.step === 3) {
      setSearching(true);
      props.runSearch();
    }
  };
  return (
    <div>
      <StepsHeader user={props.user} />
      <div className="main-container">
        <h4 className="btn-action-subtext">{subHeading}</h4>
        <div className="card">
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
          {props.step === 2 &&
            (loadingFiles ? (
              <div className="progress-container">
                <svg className="progress-ring" height="200" width="200">
                  <circle
                    className="progress-ring__circle"
                    strokeWidth="4"
                    fill="#1ed760"
                    stroke="white"
                    r="86"
                    cx="100"
                    cy="100"
                    style={{
                      strokeDashoffset: `${
                        2 * Math.PI * 86 -
                        (2 * Math.PI * 86 * currentFileCount) / totalFileCount
                      }`,
                    }}
                  />
                </svg>
                <h4 className="percent-complete">
                  {currentFileCount} / {totalFileCount}
                </h4>
              </div>
            ) : (
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
            ))}
          {props.step === 3 &&
            (searching ? (
              <div className="progress-container">
                <svg className="progress-ring" height="200" width="200">
                  <circle
                    className="progress-ring__circle"
                    strokeWidth="4"
                    fill="#1ed760"
                    stroke="white"
                    r="86"
                    cx="100"
                    cy="100"
                    style={{
                      strokeDashoffset: `${
                        2 * Math.PI * 86 -
                        (2 * Math.PI * 86 * props.currentSearchSong) /
                          props.localSongs.length
                      }`,
                    }}
                  />
                </svg>
                <h4 className="percent-complete">
                  {props.currentSearchSong} / {props.localSongs.length}
                </h4>
              </div>
            ) : (
              <img
                className="main-step-btn"
                alt={"run search"}
                src={icon}
                onClick={async () => {
                  await props.runSearch();
                }}
              />
            ))}

          <button className="main-btn" onClick={() => handleClick()}>
            {/* handle invisible file input on step 2 */}
            {props.step === 2 ? (
              <label htmlFor="fileUpload2">
                {heading}
                <input
                  type="file"
                  id="fileUpload2"
                  onClick={(e) => {
                    e.preventDefault();
                    inputElem.current.click();
                  }}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <p>{heading}</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepScreen;
