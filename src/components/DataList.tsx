/* eslint-disable eqeqeq */
/* eslint-disable react/sort-comp */
import { Observer, observer } from 'mobx-react';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import * as FiIcons from 'react-icons/fi';
import * as React from 'react';
import { ReactWindowScroller } from 'react-window-scroller';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as LazyList } from 'react-window';
import Scrollbars from 'rc-scrollbars';
import { WindowScroller } from 'react-virtualized';
import { contextMenu, ShowContextMenuParams } from 'react-contexify';
import {
  Music,
  PlayingFromType,
  QueueEntry,
  QueueEntryState,
} from '../back-end/models';
import { ButtonsClassNames } from '../constants/ClassNames';
import TypesUtils from '../utils/TypesUtils';
import ContextMenu, { MENU_ID } from './ContextMenu';
import GlobalRefs from '../utils/Ref';
import IconButton from './IconButton';
import noAlbumArt from '../../assets/no-album-art.png';
import RootStore from '../back-end/store/RootStore';
import { StoreContext } from '../utils/StoreContext';
import PlayingIcon from './PlayingIcon';

type DataType = Music[] | QueueEntry[] | QueueEntry | undefined; // | Playlist

interface Props {
  data: DataType;
  headerHidden?: boolean;
  filterHidden?: boolean;
  addedHidden?: boolean;
  playingFromType: PlayingFromType;
  playingFromId?: number;
  handleOnPlay: (...args: any) => void;
}

interface State {
  filter: string;
}

const DataList = observer(
  class DataList extends React.Component<Props, State> {
    filteredData = new Array<Music>();

    constructor(props: Props) {
      super(props);

      this.state = {
        filter: '',
      };
    }

    handleContextMenu(event: any, musicId: number) {
      const params: ShowContextMenuParams = {
        id: MENU_ID,
        event,
        props: {
          musicId,
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

    filterData() {
      const { filter } = this.state;
      const { data } = this.props;
      this.filteredData = (data as Array<Music>).filter(
        (music) =>
          (music.title && music.title.toLowerCase().includes(filter)) ||
          (music.album && music.album.toLowerCase().includes(filter)) ||
          (music.artists &&
            music.artists.some((artist) =>
              artist.toLowerCase().includes(filter)
            ))
      );
    }

    CurrentQueueEntryItemView = observer(() => {
      const { data } = this.props;
      const { playerStore } = this.context as RootStore;
      if (!(data as QueueEntry).music) return null;
      const queueEntry = data as QueueEntry;
      const {
        id,
        title,
        artists,
        album,
        albumArt,
        addedString,
        durationString,
      } = queueEntry.music!;
      const isActive = this.isCurrentActive(id);
      return (
        <div
          className={`Item Active ${
            isActive && playerStore.player.playing ? 'Playing' : ''
          }`}
        >
          <div className="LeftOptions">
            <span className="Order">1</span>
            <IconButton
              icon={<BsIcons.BsPlayFill className={ButtonsClassNames.Icon} />}
              className="PlayButton"
              onClick={() => {
                playerStore.player.togglePlaying();
              }}
            />
            <IconButton
              icon={<BsIcons.BsPauseFill className={ButtonsClassNames.Icon} />}
              className="PauseButton"
              onClick={() => playerStore.player.togglePlaying()}
            />
            <PlayingIcon className="PlayingIcon" />
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
          <div className="Added" />
          <div className="Duration">{durationString}</div>
        </div>
      );
    });

    QueueEntryItemView = observer(({ index, style }) => {
      const { data } = this.props;
      const { playerStore } = this.context as RootStore;
      if (!(data as Array<QueueEntry>)[index].music) return null;
      const {
        id,
        title,
        artists,
        album,
        albumArt,
        addedString,
        durationString,
      } = (data as Array<QueueEntry>)[index].music!;
      return (
        <div style={style}>
          <div className="Item">
            <div className="LeftOptions">
              <span className="Order">{index ? index + 1 : 1}</span>
              <IconButton
                icon={<BsIcons.BsPlayFill className={ButtonsClassNames.Icon} />}
                className="PlayButton"
                onClick={() => {
                  playerStore.player.togglePlaying();
                }}
              />
              <IconButton
                icon={
                  <BsIcons.BsPauseFill className={ButtonsClassNames.Icon} />
                }
                className="PauseButton"
                onClick={() => playerStore.player.togglePlaying()}
              />
              <PlayingIcon className="PlayingIcon" />
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
            <div className="Added" />
            <div className="Duration">{durationString}</div>
          </div>
        </div>
      );
    });

    MusicItem = observer(({ index, style }) => {
      const { data } = this.props;
      const { filter } = this.state;
      const { playerStore } = this.context as RootStore;
      const {
        id,
        title,
        artists,
        album,
        albumArt,
        addedString,
        durationString,
      } =
        filter.length > 0
          ? this.filteredData[index]
          : (data as Array<Music>)[index];
      const isActive = this.isCurrentActive(id);
      if (title) {
        return (
          <div style={style}>
            <div
              className={`Item ${isActive ? 'Active' : ''} ${
                isActive && playerStore.player.playing ? 'Playing' : ''
              }`}
              onContextMenu={(event) => {
                this.handleContextMenu(event, id);
              }}
            >
              <div className="LeftOptions">
                <span className="Order">{index + 1}</span>
                <IconButton
                  icon={
                    <BsIcons.BsPlayFill className={ButtonsClassNames.Icon} />
                  }
                  className="PlayButton"
                  onClick={() => {
                    if (isActive) {
                      playerStore.player.togglePlaying();
                    } else {
                      playerStore.player.playCurrentMainLibrary(id);
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
                <PlayingIcon className="PlayingIcon" />
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
          </div>
        );
      }
      return (
        <div style={style}>
          <div className="LoadingItem">
            <div className="dot-elastic" />
          </div>
        </div>
      );
    });

    DataList = () => {
      const { data, playingFromType } = this.props;
      if (TypesUtils.isQueueEntryArray(data)) {
        return (
          <LazyList
            className="window-scroller-override"
            height={window.innerHeight}
            width={600}
            itemSize={50}
            style={{ overflow: 'hidden' }}
            itemCount={(data as Array<QueueEntry>).length}
            ref={(node) => {
              if (playingFromType === PlayingFromType.PriorityQueue) {
                GlobalRefs.priorityQueueEntriesRef = node;
              } else {
                GlobalRefs.queueEntriesRef = node;
              }
            }}
          >
            {this.QueueEntryItemView}
          </LazyList>
        );
      }

      if (TypesUtils.isMusicArray(data as Array<QueueEntry>)) {
        const { filter } = this.state;
        if (filter.length > 0) this.filterData();
        return (
          <LazyList
            className="window-scroller-override"
            height={window.innerHeight}
            width={600}
            itemSize={50}
            style={{ overflow: 'hidden' }}
            itemCount={
              filter.length > 0
                ? (this.filteredData as Array<Music>).length
                : (data as Array<Music>).length
            }
            ref={(node) => {
              GlobalRefs.musicListRef = node;
            }}
          >
            {this.MusicItem}
          </LazyList>
        );
      }
      return null;
    };

    dataExists() {
      const { data } = this.props;
      if (TypesUtils.isQueueEntry(data)) {
        return (data as QueueEntry).state === QueueEntryState.Playing;
      }
      if (TypesUtils.isQueueEntryArray(data)) return true;
      if (TypesUtils.isMusicArray(data)) return true;
      return false;
    }

    handleOnFilterChnage = (e: React.FormEvent<HTMLInputElement>) => {
      this.setState({ filter: e.currentTarget.value });
    };

    render() {
      if (this.dataExists()) {
        const { filterHidden, headerHidden, addedHidden, data } = this.props;
        const { filter } = this.state;
        return (
          <div className="DataList">
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
                    {!addedHidden && (
                      <BiIcons.BiCalendarAlt
                        className={ButtonsClassNames.Icon}
                      />
                    )}
                  </div>
                  <div className="Duration">
                    <FiIcons.FiClock className={ButtonsClassNames.Icon} />
                  </div>
                </div>
              )}
              <div className="Items">
                {TypesUtils.isQueueEntry(data) && (
                  <this.CurrentQueueEntryItemView />
                )}
                {TypesUtils.isArray(data) && <this.DataList />}
              </div>
            </div>
            <ContextMenu />
          </div>
        );
      }
      return (
        <div className="NoMusicFound">
          <BsIcons.BsMusicNoteList className={ButtonsClassNames.Icon} />
          No music found
        </div>
      );
    }
  }
);

DataList.contextType = StoreContext;

export default DataList;
