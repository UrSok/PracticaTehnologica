CREATE TABLE Library (
      id   INTEGER PRIMARY KEY AUTOINCREMENT
                   NOT NULL,
      path VARCHAR NOT NULL
    );
	
CREATE TABLE Music (
    id       INTEGER PRIMARY KEY AUTOINCREMENT
                     NOT NULL,
    src      VARCHAR NOT NULL,
    src_type INT     NOT NULL
                     DEFAULT (0) 
);
CREATE TABLE Playlist (
      id  INTEGER PRIMARY KEY AUTOINCREMENT
                  NOT NULL,
      name VARCHAR NOT NULL
    );
CREATE TABLE PlaylistMusic (
      id          INTEGER PRIMARY KEY AUTOINCREMENT
                          NOT NULL,
      playlist_id INTEGER REFERENCES Playlist (id)
                          NOT NULL,
      music_id    INTEGER REFERENCES Music (id)
                          NOT NULL
    );