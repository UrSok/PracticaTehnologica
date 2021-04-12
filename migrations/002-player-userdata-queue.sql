CREATE TABLE QueueEntry (
    id         INTEGER NOT NULL,
    musicId    INTEGER REFERENCES Music (id)
                       NOT NULL,
    fromType   INTEGER NOT NULL,
    fromId     INTEGER,
    state      INTEGER NOT NULL
);

CREATE TABLE Player (
    shuffle                       BOOLEAN        NOT NULL,
    repeat                        INTEGER        NOT NULL
                                       CHECK (repeat BETWEEN 0 AND 2),
    playingFromType               INTEGER NOT NULL,
    playingFromId                 INTEGER,
    played                        DECIMAL (8, 7) NOT NULL
                                       CHECK (played BETWEEN 0 AND 1),
    volume                        DECIMAL (3, 2) NOT NULL
                                       CHECK (volume BETWEEN 0 AND 1),
    muted                         BOOLEAN        NOT NULL
);

CREATE TABLE UserData (
    scanOnStart BOOLEAN NOT NULL,
    firstLaunch BOOLEAN NOT NULL
);

INSERT INTO Player(shuffle, repeat, playingFromType, played, volume, muted) VALUES(false, false, 0, 0, 1, false);
INSERT INTO UserData(firstLaunch, scanOnStart) VALUES(true, true);
