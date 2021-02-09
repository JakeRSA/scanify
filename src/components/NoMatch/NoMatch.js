import React from "react";
import "../Match/Match.scss";

function NoMatch(props) {
  const { title, artist, album, duration } = props.song;
  const mm = Math.floor(duration / 60);
  let ss = Math.floor(duration % 60);
  if (ss < 10) ss = "0" + ss;
  return (
    <div className="match">
      <div
        className="local"
        style={{
          flexBasis: "100%",
        }}
      >
        <p className="title">{title}</p>
        <p className="artist">{artist}</p>
        <p className="album">{album && album}</p>
        <p className="duration">{`${mm}:${ss}`}</p>
      </div>
    </div>
  );
}

export default NoMatch;
