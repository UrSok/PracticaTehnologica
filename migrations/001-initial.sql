CREATE TABLE Library (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      path   VARCHAR NOT NULL,
      active BOOLEAN DEFAULT (1)
                     NOT NULL
    );

CREATE TABLE Music (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    src      VARCHAR NOT NULL,
    added    DATETIME DEFAULT(datetime('now','localtime'))
                     NOT NULL
);
CREATE TABLE Playlist (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      name    VARCHAR NOT NULL,
      created DATETIME DEFAULT(datetime('now','localtime'))
                      NOT NULL
    );
CREATE TABLE PlaylistMusic (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      playlistId INTEGER REFERENCES Playlist (id)
                          NOT NULL,
      musicId    INTEGER REFERENCES Music (id)
                          NOT NULL,
      added      DATETIME DEFAULT(datetime('now','localtime'))
                          NOT NULL
    );
