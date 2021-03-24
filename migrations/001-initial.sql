CREATE TABLE IF NOT EXISTS Library (
      id   INTEGER PRIMARY KEY AUTOINCREMENT
                   NOT NULL,
      path VARCHAR NOT NULL
    );
	
CREATE TABLE IF NOT EXISTS Music (
      id  INTEGER PRIMARY KEY AUTOINCREMENT
                  NOT NULL,
      src VARCHAR NOT NULL
    );
CREATE TABLE IF NOT EXISTS Playlist (
      id  INTEGER PRIMARY KEY AUTOINCREMENT
                  NOT NULL,
      name VARCHAR NOT NULL
    );
CREATE TABLE IF NOT EXISTS PlaylistMusic (
      id          INTEGER PRIMARY KEY AUTOINCREMENT
                          NOT NULL,
      playlist_id INTEGER REFERENCES Playlist (id)
                          NOT NULL,
      music_id    INTEGER REFERENCES Music (id)
                          NOT NULL
    );