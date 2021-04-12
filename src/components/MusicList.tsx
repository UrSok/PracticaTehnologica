/* eslint-disable eqeqeq */
import { Observer } from 'mobx-react';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import * as FiIcons from 'react-icons/fi';
import React from 'react';
import { Music, PlayingFromType } from '../back-end/models';
import noAlbumArt from '../../assets/no-album-art.png';
import { ButtonsClassNames } from '../constants/ClassNames';
import IconButton from './IconButton';
import RootStore from '../back-end/store/RootStore';
import { StoreContext } from '../utils/StoreContext';

interface Props {
  musicList: Music[];
  playingFromType: PlayingFromType;
  playingFromId?: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
class MusicList extends React.Component<Props, {}> {
  handleOnPlay(musicId: number) {
    const { playingFromType } = this.props;
    const { playerStore } = this.context as RootStore;
    switch (playingFromType) {
      case PlayingFromType.MainLibrary: {
        playerStore.player.playCurrentMainLibrary(musicId);
        break;
      }
      default:
        console.log('??');
    }
  }

  isCurrentActive(musicId: number): boolean {
    const { queueStore } = this.context as RootStore;
    const { currentQueueEntryOrQueueEntryPriority } = queueStore;
    const { playingFromId } = this.props;
    if (!currentQueueEntryOrQueueEntryPriority) return false;
    if (
      playingFromId &&
      currentQueueEntryOrQueueEntryPriority.fromId == playingFromId &&
      currentQueueEntryOrQueueEntryPriority.musicId == musicId
    )
      return true;
    if (currentQueueEntryOrQueueEntryPriority.musicId == musicId) return true;
    return false;
  }

  renderData() {
    const { musicList } = this.props;
    const { playerStore } = this.context as RootStore;
    return musicList.map((music, index) => {
      const {
        id,
        title,
        artists,
        album,
        albumArt,
        addedString,
        durationString,
      } = music;
      return (
        <div
          key={id}
          className={`Item ${this.isCurrentActive(id) ? 'Active ' : ''}
          ${
            this.isCurrentActive(id) && playerStore.player.playing
              ? 'Playing'
              : ''
          }`}
        >
          <div className="LeftOptions">
            <span className="Order">{index + 1}</span>
            <IconButton
              icon={<BsIcons.BsPlayFill className={ButtonsClassNames.Icon} />}
              className="PlayButton"
              onClick={() =>
                this.isCurrentActive(id)
                  ? playerStore.player.togglePlaying()
                  : this.handleOnPlay(id)
              }
            />
            <IconButton
              icon={<BsIcons.BsPauseFill className={ButtonsClassNames.Icon} />}
              className="PauseButton"
              onClick={() => playerStore.player.togglePlaying()}
            />
            <BsIcons.BsVolumeUp
              className={`PlayingIcon ${ButtonsClassNames.Icon}`}
            />
          </div>
          <div className="MusicInfo">
            <img
              src={albumArt !== undefined ? albumArt : noAlbumArt}
              alt="album-art"
              className="AlbumArt"
            />
            <div className="TextContainer">
              <div className="Title">{title}</div>
              <div className="Artists">{artists?.join(',')}</div>
            </div>
          </div>
          <div className="Album">{album}</div>
          <div className="Added">{addedString}</div>
          <div className="Duration">{durationString}</div>
        </div>
      );
    });
  }

  render() {
    const { musicList } = this.props;
    return musicList && musicList.length > 0 ? (
      <div className="MusicList">
        <div className="Input">
          <div className="Filter">
            <BsIcons.BsSearch className="icon" />
            <input className="FilterInput" type="text" placeholder="Filter" />
          </div>
        </div>
        <div className="List">
          <div className="Head">
            <div className="LeftOptions">#</div>
            <div className="MusicInfo">TITLE</div>
            <div className="Album">ALBUM</div>
            <div className="Added">
              <BiIcons.BiCalendarAlt className={ButtonsClassNames.Icon} />
            </div>
            <div className="Duration">
              <FiIcons.FiClock className={ButtonsClassNames.Icon} />
            </div>
          </div>
          <Observer>
            {() => <div className="Items">{this.renderData()}</div>}
          </Observer>
        </div>
      </div>
    ) : (
      <div className="NoMusicFound">
        <BsIcons.BsMusicNoteList className={ButtonsClassNames.Icon} />
        No music found
      </div>
    );
  }
}

MusicList.contextType = StoreContext;

export default MusicList;
