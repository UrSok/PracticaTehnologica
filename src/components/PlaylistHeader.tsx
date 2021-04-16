import { Observer } from 'mobx-react';
import React from 'react';
import Button from './Button';

interface Props {
  // eslint-disable-next-line @typescript-eslint/ban-types
  playlist?: Object;
}

const playlistEx = {
  id: 1,
  imageSource:
    'https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png',
  title: 'My Shazam Tracks',
  nrOfSongs: 18,
  duration: '1 h 10 min', // the sum of all songs' duration
};

const PlaylistHeader: React.FC<Props> = () => {
  // const { playlist } = this?.props;
  // return playlist.map(() => {
  const { id, imageSource, title, nrOfSongs, duration } = playlistEx;
  return (
    <div className="PlaylistHeader" key={id}>
      {/* <img className="HeaderImage" src={imageSource} alt="test" /> */}
      <div className="HeaderData">
        <span className="HeaderLabel">PLAYLIST</span>
        <h1 className="HeaderTitle">{title}</h1>
        <span className="HeaderMetaInfo">
          • {nrOfSongs} songs, {duration}
        </span>

        <div className="HeaderButtons">
          <div className="HeaderButton">
            <Button className="PlayButton" text="Play" onClick={() => {}} />
          </div>

          <div className="HeaderButton">
            <Button className="MoreButton" text="•••" onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
  // });
};

export default PlaylistHeader;
