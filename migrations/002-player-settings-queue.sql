CREATE TABLE Queue (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      music_id    INTEGER REFERENCES Music (id)
                          NOT NULL,
    );

CREATE TABLE UserData (
    shuffle           BOOLEAN,
    repeat            INT     CHECK (repeat > 0),
    playing_music_id  INT     REFERENCES Music (id),
    playing_from_type INTEGER CHECK (playing_from_type > 0),
    playing_from_id   INTEGER,
    scan_on_start     BOOLEAN,
    first_launch      BOOLEAN NOT NULL
);

INSERT INTO UserData(first_launch) VALUES(true);
