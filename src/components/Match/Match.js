import React, { useState } from "react";
import "./Match.scss";

function Match(props) {
  const { title, artist, album, duration, id, addToLib } = props.song;
  let spotify = props.song.spotify;

  // for partial matches, use only the first matching result
  if (Array.isArray(spotify)) {
    spotify = spotify[0];
  }

  const mm = Math.floor(duration / 60);
  let ss = Math.floor(duration % 60);
  if (ss < 10) ss = "0" + ss;
  const MM = Math.floor(spotify.duration_ms / 60000);
  let SS = Math.floor((spotify.duration_ms / 1000) % 60);
  if (SS < 10) SS = "0" + SS; 

  const spotifyArtistsArray = spotify.artists.map((artist) => {
    return artist.name;
  });
  const spotifyArtists = spotifyArtistsArray.join(", ");
  const [addToLibState, setAddToLibState] = useState(addToLib);

  return (
    <div className="match">
      <div className="local">
        <p className="title">{title}</p>
        <p className="artist">{artist}</p>
        <p className="album">{album && album}</p>
        <p className="duration">{`${mm}:${ss}`}</p>
      </div>
      <div className="spotify">
        <div>
          <p className="title">{spotify.name}</p>
          <p className="artist">{spotifyArtists}</p>
          <p className="album">{spotify.album.name}</p>
          <p className="duration">{`${MM}:${SS}`}</p>
        </div>

        <img
          alt={spotifyArtists + " - " + spotify.album.name}
          src={spotify.album.images[1].url}
        />
      </div>
      <div
        className={`add-to-lib-div ${
          addToLib ? "add-to-lib-true" : "add-to-lib-false"
        }`}
        onClick={() => {
          setAddToLibState(!addToLibState);
          props.toggleAddToLib(id);
        }}
      >{addToLib ? 'yes' : 'skip'}</div>
    </div>
  );
}

export default Match;
