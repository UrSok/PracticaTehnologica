import React from 'react';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import { ButtonsClassNames, PagesClassNames } from '../constants/ClassNames';
import PageTitle from '../components/PageTitle';
import IconButton from '../components/IconButton';
import Button from '../components/Button';
import MusicPlayer from '../components/MusicPlayer';
import Table from '../components/Table';
import MusicManager from '../back-end/managers/MusicManager';

const Playlist: React.FC = () => {
  const handlePlayPause = (disabled: boolean) => {
    // if (disabled) {
    // }
  };
  // musicPlayer = new MusicPlayer();

  return (
    <div className={PagesClassNames.Playlist}>
      {/* <PageTitle PageName="Playlist" /> */}
      <div className="PlaylistHeader">
        <img
          className="HeaderImage"
          src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
          alt="test"
        />
        <div className="HeaderData">
          <span className="HeaderLabel">PLAYLIST</span>
          <h1 className="HeaderTitle">My Shazam Tracks</h1>
          <span className="HeaderMetaInfo"> • 18 songs, 1 h 10 min</span>

          <div className="HeaderButtons">
            <div className="HeaderButton">
              <Button
                className="PlayButton"
                text="Play"
                // disabled
                onClick={() => {}}
              />
            </div>

            <div className="HeaderButton">
              {/* <IconButton
                className="MoreButton"
                icon={<FiIcons.FiMoreHorizontal className="icon" />}
                onClick={() => {}}
              /> */}
              <Button className="MoreButton" text="•••" onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>

      <div className="Input">
        <div className="Filter">
          <BsIcons.BsSearch className="icon" />
          <input className="FilterInput" type="text" placeholder="Filter" />
        </div>
      </div>
      <Table musicList={MusicManager.instance.queue} />
    </div>
  );
};

export default Playlist;
