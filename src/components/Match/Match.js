import React from "react";
import "./Match.scss";

function Match(props) {
  const { title, artist, album, duration, spotifyMatches } = props.song;
  const mm = Math.floor(duration / 60);
  const ss = Math.floor(duration % 60);
  const MM = Math.floor(spotifyMatches.duration_ms / 60000);
  const SS = Math.floor((spotifyMatches.duration_ms / 1000) % 60);

  const spotifyArtistsArray = spotifyMatches.artists.map((artist) => {
    return artist.name;
  });
  const spotifyArtists = spotifyArtistsArray.join(", ");

  console.log(spotifyMatches);
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

        <p className="title">{spotifyMatches.name}</p>
        <p className="artist">{spotifyArtists}</p>
        <p className="album">{spotifyMatches.album.name}</p>
        <p className="duration">{`${MM}:${SS}`}</p>
        </div>
        
        <img src={spotifyMatches.album.images[1].url} />
      </div>
      <div className="add-to-lib-div"
      onClick={() => {props.toggleAddToLib()}}
      />
    </div>
  );
}

export default Match;
