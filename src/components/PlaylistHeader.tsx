import { BsTrashFill, BsMusicNoteBeamed, BsClockFill } from 'react-icons/bs';
import { IoClose, IoCheckmarkSharp } from 'react-icons/io5';
import { BiCalendarEvent } from 'react-icons/bi';
import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import toast from 'react-hot-toast';
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
  const [controlsVisible, setControlsVisibility] = useState(false);
  const [localName, setLocalName] = useState(name);

  function handlePlay() {
    if (playerStore.player.playingFromId !== playlist.id) {
      playerStore.player.playCurrentPlaylist(playlist);
    } else {
      playerStore.player.togglePlaying();
    }
  }

  function handleRemove() {
    playlist.remove();
    Navigation.replace(PathData.MainLibrary);
  }

  function isCurrentPlaylistPlaying() {
    return (
      playerStore.player.playingFromId === playlist.id &&
      playerStore.player.playing
    );
  }

  function handleFocus() {
    setControlsVisibility(true);
  }

  function handleBlur() {
    setControlsVisibility(false);
  }

  function handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    setLocalName(e.currentTarget.value);
  }

  function handleCancel() {
    setControlsVisibility(false);
    setLocalName(name);
  }

  function handleAccept() {
    if (localName.length < 1) {
      toast.error('Playlist name is too short!');
      setLocalName(name);
      return;
    }
    playlist.setName(localName);
    toast.success('Playlist name has been saved!');
  }
  return (
    <>
      <div className="PlaylistHeader">
        <div className="HeaderData">
          <span className="HeaderLabel">PLAYLIST</span>
          <div className="HeaderTitle">
            <input
              className="TitleInput"
              type="text"
              placeholder="Playlist name"
              value={localName}
              onFocus={handleFocus}
              onBlur={() => {
                setTimeout(handleBlur, 100);
              }}
              onChange={handleInputChange}
            />
            {controlsVisible && (
              <div className="SaveControls">
                <IconButton
                  icon={<IoClose className="Icon" />}
                  onClick={handleCancel}
                />
                <IconButton
                  className="AcceptButton"
                  icon={<IoCheckmarkSharp className="Icon" />}
                  onClick={handleAccept}
                />
              </div>
            )}
          </div>
          <div className="HeaderMetaInfo">
            <div className="Date">
              <BiCalendarEvent className="Icon" /> <span>{dateCreated}</span>
            </div>
            <div className="TotalSongs">
              <BsMusicNoteBeamed className="Icon" /> <span>{totalSongs}</span>
            </div>
            <div className="PlaylistDuration">
              <BsClockFill className="Icon" /> <span>{totalSongsDuration}</span>
            </div>
          </div>
          <div className="HeaderButtons">
            <Button
              className="PlayButton"
              text={isCurrentPlaylistPlaying() ? 'Pause' : 'Play'}
              onClick={handlePlay}
            />
            <IconButton
              className="DeleteButton"
              icon={<BsTrashFill className="Icon" />}
              onClick={handleRemove}
            />
          </div>
        </div>
      </div>

      <StickyHeader title={name} className="PlaylistStickyHeader">
        <div className="RightControls">
          <Button
            className="PlayButton"
            text={isCurrentPlaylistPlaying() ? 'Pause' : 'Play'}
            onClick={handlePlay}
          />
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
