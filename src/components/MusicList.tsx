/* eslint-disable eqeqeq */
import { Observer } from 'mobx-react';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import * as FiIcons from 'react-icons/fi';
import React from 'react';
import { contextMenu, ShowContextMenuParams } from 'react-contexify';
import { Music, PlayingFromType } from '../back-end/models';
import noAlbumArt from '../../assets/no-album-art.png';
import { ButtonsClassNames } from '../constants/ClassNames';
import IconButton from './IconButton';
import RootStore from '../back-end/store/RootStore';
import { StoreContext } from '../utils/StoreContext';
import ContextMenu from './ContextMenu';

interface Props {
  musicList: Music[];
  headerHidden?: boolean;
  filterHidden?: boolean;
  playingFromType: PlayingFromType;
  playingFromId?: number;
  handleOnPlay: (...args: any) => void;
}

interface State {
  filter: string;
}

const MENU_ID = 1;

class MusicList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      filter: '',
    };
  }

  handleOnFilterChnage = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ filter: e.currentTarget.value });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleContextMenu(event: any, musicId: number, index: number) {
    const params: ShowContextMenuParams = {
      id: MENU_ID,
      event,
      props: {
        musicId,
        index,
        context: this.context,
      },
    };
    contextMenu.show(params);
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
    const { musicList, playingFromType } = this.props;
    // musicList.filter
    const { filter } = this.state;
    const resultList = musicList.filter(
      (music) =>
        (music.title && music.title.toLowerCase().includes(filter)) ||
        (music.album && music.album.toLowerCase().includes(filter))
    );
    const { playerStore, queueStore } = this.context as RootStore;
    return resultList.map((music, index) => {
      const {
        id,
        title,
        artists,
        album,
        albumArt,
        addedString,
        durationString,
      } = music;
      if (
        playingFromType === PlayingFromType.PriorityQueue &&
        index === 0 &&
        queueStore.priorityQueue
      )
        return null;
      const { handleOnPlay } = this.props;
      return (
        title && (
          <div
            key={playingFromType != PlayingFromType.PriorityQueue ? id : index}
            className={`Item ${
              this.isCurrentActive(id) &&
              playingFromType != PlayingFromType.PriorityQueue
                ? 'Active '
                : ''
            }
          ${
            this.isCurrentActive(id) &&
            playerStore.player.playing &&
            playingFromType != PlayingFromType.PriorityQueue
              ? 'Playing'
              : ''
          }`}
            onContextMenu={(event) => {
              this.handleContextMenu(event, id, index);
            }}
          >
            <div className="LeftOptions">
              <span className="Order">{index + 1}</span>
              <IconButton
                icon={<BsIcons.BsPlayFill className={ButtonsClassNames.Icon} />}
                className="PlayButton"
                onClick={() => {
                  if (this.isCurrentActive(id)) {
                    playerStore.player.togglePlaying();
                  } else if (
                    playingFromType === PlayingFromType.PriorityQueue
                  ) {
                    handleOnPlay(index, this.context);
                  } else {
                    handleOnPlay(id, this.context);
                  }
                }}
              />
              <IconButton
                icon={
                  <BsIcons.BsPauseFill className={ButtonsClassNames.Icon} />
                }
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
        )
      );
    });
  }

  render() {
    const { musicList, headerHidden, filterHidden } = this.props;
    const { filter } = this.state;
    return (
      <Observer>
        {() =>
          musicList && musicList.length > 0 ? (
            <div className="MusicList">
              {!filterHidden && (
                <div className="Input">
                  <div className="Filter">
                    <BsIcons.BsSearch className="Icon" />
                    <input
                      className="FilterInput"
                      type="text"
                      placeholder="Filter"
                      value={filter}
                      onChange={this.handleOnFilterChnage}
                    />
                  </div>
                </div>
              )}
              <div className="List">
                {!headerHidden && (
                  <div className="Head">
                    <div className="LeftOptions">#</div>
                    <div className="MusicInfo">TITLE</div>
                    <div className="Album">ALBUM</div>
                    <div className="Added">
                      <BiIcons.BiCalendarAlt
                        className={ButtonsClassNames.Icon}
                      />
                    </div>
                    <div className="Duration">
                      <FiIcons.FiClock className={ButtonsClassNames.Icon} />
                    </div>
                  </div>
                )}
                <div className="Items">{this.renderData()}</div>
              </div>
              <ContextMenu />
            </div>
          ) : (
            <div className="NoMusicFound">
              <BsIcons.BsMusicNoteList className={ButtonsClassNames.Icon} />
              No music found
            </div>
          )
        }
      </Observer>
    );
  }
}
MusicList.contextType = StoreContext;

export default MusicList;
