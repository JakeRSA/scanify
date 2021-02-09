import React from "react";
import "./FinalAction.scss";
import { Formik, Form, Field } from "formik";

function FinalAction(props) {
  const trackIDs = props.songs.reduce((IDs, track) => {
    if (track.addToLib) {
      if (Array.isArray(track.spotify)) {
        IDs.push(track.spotify[0].id);
      } else {
        IDs.push(track.spotify.id);
      }
    }
    return IDs;
  }, []);
  const playlistOptions = props.playlists.map((playlist) => (
    <option key={playlist.id} value={playlist.id}>
      {playlist.name}
    </option>
  ));

  return (
    <div className="final-page-container">
      <div className="final">
        <h1>You've selected {trackIDs.length} tracks</h1>
        <h4>What would you like to do with them?</h4>
        <Formik
          initialValues={{
            liked: true,
            existingPlaylist: false,
            newPlaylist: false,
            existingPlaylistName: props.playlists[0] && props.playlists[0].id,
            newPlaylistName: "",
          }}
          onSubmit={(values) => {
            props.addToSpotify(trackIDs, values);
          }}
        >
          {(props) => {
            return (
              <Form className="final-form">
                <div>
                  <fieldset>
                    <label htmlFor="liked">Add to Liked Songs</label>
                    <span
                      onClick={() => {
                        props.setFieldValue("liked", !props.values.liked);
                      }}
                      className={`custom-checkbox ${
                        props.values.liked && "checkbox-true"
                      }`}
                    >
                      <Field
                        type="checkbox"
                        className="checkbox"
                        name="liked"
                        id="liked"
                      />
                    </span>
                  </fieldset>
                </div>
                <div>
                  <fieldset>
                    <label htmlFor="existingPlaylist">
                      Add to an existing playlist
                    </label>
                    <span
                      onClick={() => {
                        props.setFieldValue(
                          "existingPlaylist",
                          !props.values.existingPlaylist
                        );
                      }}
                      className={`custom-checkbox ${
                        props.values.existingPlaylist && "checkbox-true"
                      }`}
                    >
                      <Field
                        type="checkbox"
                        name="existingPlaylist"
                        id="existingPlaylist"
                        className="checkbox"
                      />
                    </span>
                  </fieldset>
                  {props.values.existingPlaylist && (
                    <fieldset>
                      <label htmlFor="existingPlaylistName">
                        playlist to add to
                      </label>
                      <Field
                        name="existingPlaylistName"
                        id="existingPlaylistName"
                        as="select"
                      >
                        {playlistOptions}
                      </Field>
                    </fieldset>
                  )}
                </div>
                <div>
                  <fieldset>
                    <label htmlFor="newPlaylist">Add to a new playlist</label>
                    <span
                      onClick={() => {
                        props.setFieldValue(
                          "newPlaylist",
                          !props.values.newPlaylist
                        );
                      }}
                      className={`custom-checkbox ${
                        props.values.newPlaylist && "checkbox-true"
                      }`}
                    >
                      <Field
                        type="checkbox"
                        name="newPlaylist"
                        id="newPlaylist"
                        className="checkbox"
                      />
                    </span>
                  </fieldset>
                  {props.values.newPlaylist && (
                    <fieldset>
                      <label htmlFor="newPlaylistName">new playlist name</label>
                      <Field
                        name="newPlaylistName"
                        id="newPlaylistName"
                      ></Field>
                    </fieldset>
                  )}
                </div>
                <button className="main-btn" type="submit">
                  let's do it
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default FinalAction;
