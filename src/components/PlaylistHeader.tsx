import { BsTrashFill } from 'react-icons/bs';
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Playlist } from '../back-end/models';
import Button from './Button';
import IconButton from './IconButton';
import Navigation from '../utils/Navigation';
import { PathData } from '../constants/RoutesInfo';
import StickyHeader from './StickyHeader';
import RootStore from '../back-end/store/RootStore';
import { StoreContext } from '../utils/StoreContext';

interface Props {
  playlist: Playlist;
}

const PlaylistHeader: React.FC<Props> = observer((props: Props) => {
  const { playlist } = props;
  const { name, totalSongs, totalSongsDuration, dateCreated } = playlist;
  const { playerStore } = useContext(StoreContext) as RootStore;

  function handlePlay() {
    playerStore.player.playCurrentPlaylist(playlist);
  }

  function handleRemove() {
    /* remove queue if playlist got removed */
    playlist.remove();
    Navigation.replace(PathData.MainLibrary);
  }

  return (
    <>
      <div className="PlaylistHeader">
        <img
          className="HeaderImage"
          src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
          alt="test"
        />
        <div className="HeaderData">
          <span className="HeaderLabel">PLAYLIST</span>
          <h1 className="HeaderTitle">{name}</h1>
          <span className="HeaderMetaInfo">
            Created on {dateCreated} • {totalSongs} song
            {totalSongs > 1 ? 's' : ''}, {totalSongsDuration}
          </span>

          <div className="HeaderButtons">
            <div className="HeaderButton">
              <Button className="PlayButton" text="Play" onClick={handlePlay} />
            </div>

            <div className="HeaderButton">
              <IconButton
                className="DeleteButton"
                icon={<BsTrashFill className="Icon" />}
                onClick={handleRemove}
              />
            </div>
          </div>
        </div>
      </div>

      <StickyHeader title={name} className="PlaylistStickyHeader">
        <div className="RightControls">
          <Button className="PlayButton" text="Play" onClick={handlePlay} />
          <IconButton
            className="DeleteButton"
            icon={<BsTrashFill className="Icon" />}
            onClick={handleRemove}
          />
        </div>
      </StickyHeader>
    </>
  );
});

export default PlaylistHeader;
