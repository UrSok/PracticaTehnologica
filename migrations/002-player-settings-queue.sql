CREATE TABLE Queue (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      musicId INTEGER REFERENCES Music (id)
                          NOT NULL
    );

CREATE TABLE UserData (
    shuffle         BOOLEAN,
    repeat          INT     CHECK (repeat BETWEEN 0 AND 2),
    playingMusicId  INT     REFERENCES Music (id),
    playingFromType INTEGER CHECK (playing_from_type >= 0),
    playingFromId   INTEGER,
    scanOnStart     BOOLEAN,
    firstLaunch     BOOLEAN NOT NULL
);

INSERT INTO UserData(firstLaunch) VALUES(true);
