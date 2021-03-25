CREATE TABLE Library (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      path VARCHAR NOT NULL
    );
	
CREATE TABLE Music (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    src      VARCHAR NOT NULL,
    src_type INT     NOT NULL
                     DEFAULT (0) 
);
CREATE TABLE Playlist (
      id  INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR NOT NULL
    );
CREATE TABLE PlaylistMusic (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      playlist_id INTEGER REFERENCES Playlist (id)
                          NOT NULL,
      music_id    INTEGER REFERENCES Music (id)
                          NOT NULL
    );