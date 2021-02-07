import axios from "axios";

export const querySpotify = (token, queryParam) => {
  const { title = "", artist = "", album = "" } = queryParam;
  const titleURI = encodeURIComponent(title);
  const artistURI = encodeURIComponent(artist);
  const albumURI = encodeURIComponent(album);

  axios
    .get(
      "https://api.spotify.com/v1/search?q=" +
        (album && `album:${albumURI}%20`) +
        (artist && `artist:${artistURI}%20`) +
        (title && `track:${titleURI}`) +
        "&type=track",
      { headers: { Authorization: "Bearer " + token } }
    )
    .then((res) => {
      return res.data.tracks.items;
    })
    .catch((err) => {
      throw err;
    });
};
