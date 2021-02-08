class LocalSong {
  constructor(title, artist, album, duration) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.duration = duration;
    this.spotify = undefined;
    this.id =
      new Date().getTime().toString(16) +
      Math.floor(Math.random() * 10000).toString(16);
    this.addToLib = false;
  }

  getTitle() {
    return this.title;
  }
  getArtist() {
    return this.artist;
  }
  getAlbum() {
    return this.album;
  }
  getDuration() {
    return this.duration;
  }

  getSpotifyMatches() {
    return this.spotify;
  }

  setSpotifyMatches(match) {
    this.spotify = match;
  }

  setAddToLib(bool) {
    this.addToLib = bool;
  }
}

export default LocalSong;
