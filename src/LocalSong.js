class LocalSong {
  constructor(title, artist, album, duration) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.duration = duration;
    this.spotifyMatches = undefined;
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
    return this.spotifyMatches;
  }

  setSpotifyMatches(match) {
    this.spotifyMatches = match;
  }
}

export default LocalSong;
