import "./App.scss";
import { useState, useEffect } from "react";
import StepScreen from "./components/StepScreen/StepScreen";
import axios from "axios";
import { searchForMatches } from "./spotifySearch";
import MatchScreen from "./components/MatchScreen/MatchScreen";
import FinalAction from "./components/FinalAction/FinalAction";

function App() {
  const { REACT_APP_CLIENT_ID, REACT_APP_REDIRECT_URL } = process.env;
  const [step, setStep] = useState(1);
  const [token, setToken] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [playlists, setPlaylists] = useState(undefined);
  const [localSongs, setLocalSongs] = useState(null);

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce(function (initial, item) {
        if (item) {
          var parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    window.location.hash = "";
    let _token = hash.access_token;

    if (_token) {
      setToken(_token);
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: { Authorization: "Bearer " + _token },
        })
        .then((res) => {
          setUser(res.data);
          setStep(2);
          axios
            .get("https://api.spotify.com/v1/me/playlists", {
              headers: { Authorization: "Bearer " + _token },
            })
            .then((res) => {
              setPlaylists(res.data.items);
            });
        });
    }
  }, []);

  const getSpotifyAuth = () => {
    const authEndpoint = "https://accounts.spotify.com/authorize";
    const scopes = ["user-library-modify user-read-email"];
    // If there is no token, redirect to Spotify authorization
    if (!token) {
      window.location =
        `${authEndpoint}?` +
        `client_id=${REACT_APP_CLIENT_ID}&` +
        `redirect_uri=${REACT_APP_REDIRECT_URL}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `response_type=token`;
    }
  };

  const getFiles = (songs) => {
    setLocalSongs(songs);
    setStep(3);
  };

  const runSearch = async () => {
    for (let song of localSongs) {
      await searchForMatches(token, song);
    }
    setStep(null);
  };

  const toggleAddToLib = (songId) => {
    const song = localSongs.find((song) => song.id === songId);
    song.setAddToLib(!song.addToLib);
  };

  return (
    <div className="App">
      {typeof step === "number" && (
        <StepScreen
          step={step}
          localSongs={localSongs}
          getSpotifyAuth={() => {
            getSpotifyAuth();
          }}
          getFiles={(files) => {
            getFiles(files);
          }}
          runSearch={() => {
            runSearch();
          }}
        />
      )}
      {!step && (
        <MatchScreen
          songs={localSongs}
          toggleAddToLib={(songId) => {
            toggleAddToLib(songId);
          }}
          toResults={() => {
            setStep("finally");
          }}
        />
      )}
      {typeof step === "string" && (
        <FinalAction songs={localSongs} playlists={playlists} />
      )}
    </div>
  );
}

export default App;
