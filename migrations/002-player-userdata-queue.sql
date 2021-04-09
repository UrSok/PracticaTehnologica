CREATE TABLE Queue (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      musicId INTEGER REFERENCES Music (id)
                          NOT NULL
    );

CREATE TABLE Player (
    shuffle         BOOLEAN NOT NULL,
    repeat          INT NOT NULL     CHECK (repeat BETWEEN 0 AND 2),
    playingMusicId  INT    REFERENCES Music (id),
    playingFromType INTEGER CHECK (playingFromType >= 0),
    playingFromId   INTEGER,
    volume          DECIMAL(3, 2) NOT NULL CHECK (volume BETWEEN 0 AND 1)
);

CREATE TABLE UserData (
    scanOnStart     BOOLEAN NOT NULL,
    firstLaunch     BOOLEAN NOT NULL
);

INSERT INTO Player(shuffle, repeat, volume) VALUES(0, 0, 1);
INSERT INTO UserData(firstLaunch, scanOnStart) VALUES(1, 1);
