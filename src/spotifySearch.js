import axios from "axios";
import similarity from "string-similarity";
import LocalSong from "./LocalSong";

const querySpotify = async (token, queryParam) => {
  const { title = "", artist = "", album = "" } = queryParam;
  const titleURI = encodeURIComponent(title);
  const artistURI = encodeURIComponent(artist);
  const albumURI = encodeURIComponent(album);

  const res = await axios.get(
    "https://api.spotify.com/v1/search?q=" +
      // not sure if it will work well with album titles
      // (album && `album:${albumURI}%20`) +
      (artist && `artist:${artistURI}%20`) +
      (title && `track:${titleURI}`) +
      "&type=track",
    { headers: { Authorization: "Bearer " + token } }
  );
  return res.data.tracks.items;
};

export const searchForMatches = async (token, localSong) => {
  const title = localSong.getTitle();
  const artist = localSong.getArtist();
  const album = localSong.getAlbum();
  const duration = localSong.getDuration();

  querySpotify(token, { title, artist, album }).then((matches) => {
    let partialMatches = [];
    for (let match of matches) {
      // check for duration match
      if (
        match.duration_ms / 1000 > duration + 5 &&
        match.duration_ms / 1000 < duration - 5
      ) {
        // add to partial matches if diff duration
        partialMatches.push(match);
        continue;
      }

      // check for album and title similarity
      const titleSim = similarity.compareTwoStrings(
        title.toLowerCase(),
        match.name.toLowerCase()
      );
      const albumSim = similarity.compareTwoStrings(
        album.toLowerCase(),
        match.album.name.toLowerCase()
      );

      if (titleSim + albumSim === 2) {
        testSong.setSpotifyMatches(match);
        break;
      }

      // check if local song has no album tag and titles are exact matches
      if (!album && titleSim === 1) {
        testSong.setSpotifyMatches(match);
        break;
      }

      // check if album and title are mostly similar
      if (titleSim > 0.8 && albumSim > 0.8) {
        testSong.setSpotifyMatches(match);
      }

      // check for partial matches
      if (titleSim > 0.7 || (albumSim > 0.6 && titleSim > 0.6)) {
        partialMatches.push(match);
      }

      if (!localSong.getSpotifyMatches()) {
        localSong.setSpotifyMatches(partialMatches);
      }
    }
  });
};
