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
    const scopes = [
      "user-library-modify playlist-modify-public playlist-modify-private user-read-email",
    ];
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
      try {
        await searchForMatches(token, song);
      } catch (err) {
        song.setSpotifyMatches([]);
        console.log(err);
      }
    }
    console.log(localSongs);
    setStep(null);
  };

  const toggleAddToLib = (songId) => {
    const song = localSongs.find((song) => song.id === songId);
    song.setAddToLib(!song.addToLib);
  };

  const addToSpotify = async (trackIDs, formValues) => {
    let newPlaylistID;
    let startIndex = 0;
    const uris = trackIDs.map((id) => `spotify:track:${id}`);

    // first need to get id of new playlist if new playlist was created
    if (formValues.newPlaylist) {
      const res = await axios.post(
        `https://api.spotify.com/v1/users/${user.id}/playlists`,
        { name: formValues.newPlaylistName },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      newPlaylistID = res.data.id;
    }

    while (startIndex < trackIDs.length) {
      if (formValues.liked) {
        axios.put(
          "https://api.spotify.com/v1/me/tracks",
          trackIDs.slice(startIndex, startIndex + 50),
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
      }
      if (formValues.existingPlaylist) {
        axios.post(
          `https://api.spotify.com/v1/playlists/${formValues.existingPlaylistName}/tracks`,
          { uris: uris.slice(startIndex, startIndex + 50) },
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
      }
      if (formValues.newPlaylist) {
        axios.post(
          `https://api.spotify.com/v1/playlists/${newPlaylistID}/tracks`,
          { uris: uris.slice(startIndex, startIndex + 50) },
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
      }
      startIndex += 50;
    }
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
        <FinalAction
          songs={localSongs}
          playlists={playlists}
          addToSpotify={(IDs, formValues) => addToSpotify(IDs, formValues)}
        />
      )}
    </div>
  );
}

export default App;
