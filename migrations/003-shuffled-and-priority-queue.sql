CREATE TABLE QueueEntryShuffled (
    id         INTEGER NOT NULL,
    musicId    INTEGER REFERENCES Music (id)
                       NOT NULL,
    fromType   INTEGER NOT NULL,
    fromId     INTEGER,
    state      INTEGER NOT NULL
);

CREATE TABLE QueueEntryPriority (
    id         INTEGER NOT NULL,
    musicId    INTEGER REFERENCES Music (id)
                       NOT NULL,
    fromType   INTEGER NOT NULL,
    fromId     INTEGER,
    state      INTEGER NOT NULL
);
