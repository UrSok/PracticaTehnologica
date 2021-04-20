/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable eqeqeq */
/* eslint-disable react/sort-comp */
import { observer } from 'mobx-react';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import * as FiIcons from 'react-icons/fi';
import * as RiIcons from 'react-icons/ri';
import * as React from 'react';
import { FixedSizeList as LazyList } from 'react-window';
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
import PlaylistEntry from '../back-end/models/PlaylistEntry.model';

type DataType =
  | Music[]
  | QueueEntry[]
  | QueueEntry
  | PlaylistEntry[]
  | undefined;
type DataTypeForContextMenu = Music | QueueEntry | PlaylistEntry | undefined;

interface Props {
  data: DataType;
  headerHidden?: boolean;
  filterHidden?: boolean;
  addedHidden?: boolean;
  showPlayingFrom?: boolean;
  priorityQueue?: boolean;
  fromId?: number;
}

interface State {
  textFilter: string;
}

const DataList = observer(
  class DataList extends React.Component<Props, State> {
    filteredData: Array<Music> | Array<PlaylistEntry> = new Array<Music>();

    constructor(props: Props) {
      super(props);

      this.state = {
        textFilter: '',
      };
    }

    handleContextMenu(
      event: any,
      entry: DataTypeForContextMenu,
      priorityQueue?: boolean
    ) {
      const params: ShowContextMenuParams = {
        id: MENU_ID,
        event,
        props: {
          entry,
          priorityQueue,
          context: this.context,
        },
      };
      contextMenu.show(params);
    }

    isCurrentActive(musicId: number): boolean {
      const { queueStore } = this.context as RootStore;
      const { currentQueueEntryOrQueueEntryPriority } = queueStore;
      const { fromId: playingFromId } = this.props;
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

    filterMusicData() {
      const { textFilter } = this.state;
      const { data } = this.props;
      this.filteredData = (data as Array<Music>).filter(
        (music) =>
          (music.title &&
            music.title.toLowerCase().includes(textFilter.toLowerCase())) ||
          (music.album &&
            music.album.toLowerCase().includes(textFilter.toLowerCase())) ||
          (music.artists &&
            music.artists.some((artist) =>
              artist.toLowerCase().includes(textFilter.toLowerCase())
            ))
      );
    }

    filterPlaylistData() {
      const { textFilter } = this.state;
      const { data } = this.props;
      this.filteredData = (data as Array<PlaylistEntry>).filter(
        (entry) =>
          (entry &&
            entry.music &&
            entry.music.title &&
            entry.music.title
              .toLowerCase()
              .includes(textFilter.toLowerCase())) ||
          (entry.music.album &&
            entry.music.album
              .toLowerCase()
              .includes(textFilter.toLowerCase())) ||
          (entry.music.artists &&
            entry.music.artists.some((artist) =>
              artist.toLowerCase().includes(textFilter.toLowerCase())
            ))
      );
    }

    CurrentQueueEntryItemView = observer(() => {
      const { data, showPlayingFrom } = this.props;
      const { playerStore, queueStore } = this.context as RootStore;
      if (!(data as QueueEntry).music) return null;
      const queueEntry = data as QueueEntry;
      const { fromName } = queueEntry;
      const {
        id,
        title,
        artists,
        album,
        albumArt,
        durationString,
      } = queueEntry.music!;
      return (
        <div
          className={`Item Active ${
            playerStore.player.playing ? 'Playing' : ''
          }`}
          onContextMenu={(event) => {
            this.handleContextMenu(
              event,
              data as QueueEntry,
              queueStore.isQueueEntryPriorityPlaying
            );
          }}
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
              <div className="Artists">{artists?.join(', ')}</div>
            </div>
          </div>
          <div className="Album">{album}</div>
          <div className="Added">{showPlayingFrom && `${fromName}`}</div>
          <div className="Duration">{durationString}</div>
        </div>
      );
    });

    QueueEntryItemView = observer(({ index, style }) => {
      const { data, showPlayingFrom } = this.props;
      const { playerStore, queueStore } = this.context as RootStore;
      const queueEntry = (data as Array<QueueEntry>)[index] as QueueEntry;
      if (!queueEntry.music) return null;
      const { fromName } = queueEntry;
      const {
        id,
        title,
        artists,
        album,
        albumArt,
        durationString,
      } = queueEntry.music!;
      return (
        <div style={style}>
          <div
            className="Item"
            onContextMenu={(event) => {
              this.handleContextMenu(event, (data as Array<QueueEntry>)[index]);
            }}
          >
            <div className="LeftOptions">
              <span className="Order">
                {index + queueStore.priorityQueue.length + 2}
              </span>
              <IconButton
                icon={<BsIcons.BsPlayFill className={ButtonsClassNames.Icon} />}
                className="PlayButton"
                onClick={() => {
                  queueStore.setPlayingByMusicId(id);
                }}
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
                <div className="Artists">{artists?.join(', ')}</div>
              </div>
            </div>
            <div className="Album">{album}</div>
            <div className="Added">{showPlayingFrom && `${fromName}`}</div>
            <div className="Duration">{durationString}</div>
          </div>
        </div>
      );
    });

    PriorityQueueEntryItemView = observer(({ data, index, style }) => {
      const { showPlayingFrom } = this.props;
      const { playerStore, queueStore } = this.context as RootStore;
      const queueEntry = data[index] as QueueEntry;
      if (!queueEntry.music) return null;
      const { fromName } = queueEntry;
      const {
        title,
        artists,
        album,
        albumArt,
        durationString,
      } = queueEntry.music!;
      return (
        <div style={style}>
          <div
            className="Item"
            onContextMenu={(event) => {
              this.handleContextMenu(
                event,
                (data as Array<QueueEntry>)[index],
                true
              );
            }}
          >
            <div className="LeftOptions">
              <span className="Order">{index + 2}</span>
              <IconButton
                icon={<BsIcons.BsPlayFill className={ButtonsClassNames.Icon} />}
                className="PlayButton"
                onClick={() => {
                  queueStore.setPlayingPriorityQueueEntryByIndex(index);
                }}
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
                <div className="Artists">{artists?.join(', ')}</div>
              </div>
            </div>
            <div className="Album">{album}</div>
            <div className="Added">{showPlayingFrom && `${fromName}`}</div>
            <div className="Duration">{durationString}</div>
          </div>
        </div>
      );
    });

    PlaylistEntryItem = observer(({ index, style }) => {
      const { data } = this.props;
      const { textFilter } = this.state;
      const { playerStore, queueStore, playlistStore } = this
        .context as RootStore;
      const { music, addedString, playlistId, musicId } =
        textFilter.length > 0
          ? (this.filteredData as Array<PlaylistEntry>)[index]
          : (data as Array<PlaylistEntry>)[index];
      if (!music) return null;
      const { id, title, artists, album, albumArt, durationString } = music;
      const isActive = (): boolean => {
        const currentQueueEntry =
          queueStore.currentQueueEntryOrQueueEntryPriority;
        if (!currentQueueEntry) return false;
        if (
          currentQueueEntry.fromId == playlistId &&
          currentQueueEntry.musicId === musicId
        )
          return true;
        return false;
      };
      if (title) {
        return (
          <div style={style}>
            <div
              className={`Item FilterableItem ${isActive() ? 'Active' : ''} ${
                isActive() && playerStore.player.playing ? 'Playing' : ''
              }`}
              onContextMenu={(event) => {
                this.handleContextMenu(
                  event,
                  (data as Array<PlaylistEntry>)[index]
                );
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
                    if (isActive()) {
                      playerStore.player.togglePlaying();
                    } else {
                      const playlist = playlistStore.getById(playlistId);
                      if (playlist)
                        playerStore.player.playCurrentPlaylist(playlist, id);
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
                  <div
                    className="Title"
                    onClick={() => {
                      this.handleFilter(title);
                    }}
                  >
                    {title}
                  </div>
                  <div className="Artists">
                    {artists?.map((artist, artistIndex) => {
                      return (
                        <>
                          <span
                            className="Artist"
                            onClick={() => {
                              this.handleFilter(artist);
                            }}
                          >
                            {artist}
                          </span>
                          <span>
                            {artists.length - 1 !== artistIndex ? ', ' : ''}
                          </span>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div
                className="Album"
                onClick={() => {
                  if (album) this.handleFilter(album);
                }}
              >
                {album}
              </div>
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

    MusicItem = observer(({ index, style }) => {
      const { data } = this.props;
      const { textFilter } = this.state;
      const { playerStore, queueStore } = this.context as RootStore;
      const {
        id,
        title,
        artists,
        album,
        albumArt,
        addedString,
        durationString,
      } =
        textFilter.length > 0
          ? (this.filteredData as Array<Music>)[index]
          : (data as Array<Music>)[index];
      const isActive = (): boolean => {
        const currentQueueEntry =
          queueStore.currentQueueEntryOrQueueEntryPriority;
        if (!currentQueueEntry) return false;
        if (
          currentQueueEntry.fromType == PlayingFromType.MainLibrary &&
          currentQueueEntry.musicId === id
        )
          return true;
        return false;
      };
      if (title) {
        return (
          <div style={style}>
            <div
              className={`Item FilterableItem ${isActive() ? 'Active' : ''} ${
                isActive() && playerStore.player.playing ? 'Playing' : ''
              }`}
              onContextMenu={(event) => {
                this.handleContextMenu(event, (data as Array<Music>)[index]);
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
                    if (isActive()) {
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
                  <div
                    className="Title"
                    onClick={() => {
                      this.handleFilter(title);
                    }}
                  >
                    {title}
                  </div>
                  <div className="Artists">
                    {artists?.map((artist, artistIndex) => {
                      return (
                        <>
                          <span
                            className="Artist"
                            onClick={() => {
                              this.handleFilter(artist);
                            }}
                          >
                            {artist}
                          </span>
                          <span>
                            {artists.length - 1 !== artistIndex ? ', ' : ''}
                          </span>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div
                className="Album"
                onClick={() => {
                  if (album) this.handleFilter(album);
                }}
              >
                {album}
              </div>
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
      const { data, priorityQueue } = this.props;
      const { textFilter } = this.state;
      if (TypesUtils.isPlaylistEntryArray(data)) {
        if (textFilter.length > 0) this.filterPlaylistData();
        return (
          <LazyList
            className="window-scroller-override"
            height={window.innerHeight}
            width={600}
            itemSize={50}
            style={{ overflow: 'hidden' }}
            itemCount={
              textFilter.length > 0
                ? (this.filteredData as Array<PlaylistEntry>).length
                : (data as Array<PlaylistEntry>).length
            }
            ref={(node) => {
              GlobalRefs.musicListRef = node;
            }}
          >
            {this.PlaylistEntryItem}
          </LazyList>
        );
      }

      if (TypesUtils.isQueueEntryArray(data) && priorityQueue) {
        const { queueStore } = this.context as RootStore;
        const priorityQueueWithoutFirst = queueStore.isQueueEntryPriorityPlaying
          ? queueStore.priorityQueue.slice(1, queueStore.priorityQueue.length)
          : undefined;
        return (
          <LazyList
            className="window-scroller-override"
            height={window.innerHeight}
            width={600}
            itemSize={50}
            style={{ overflow: 'hidden' }}
            itemData={priorityQueueWithoutFirst ?? queueStore.priorityQueue}
            itemCount={
              priorityQueueWithoutFirst
                ? priorityQueueWithoutFirst.length
                : queueStore.priorityQueue.length
            }
            ref={(node) => {
              GlobalRefs.priorityQueueEntriesRef = node;
            }}
          >
            {this.PriorityQueueEntryItemView}
          </LazyList>
        );
      }

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
              GlobalRefs.queueEntriesRef = node;
            }}
          >
            {this.QueueEntryItemView}
          </LazyList>
        );
      }

      if (TypesUtils.isMusicArray(data as Array<QueueEntry>)) {
        if (textFilter.length > 0) this.filterMusicData();
        return (
          <LazyList
            className="window-scroller-override"
            height={window.innerHeight}
            width={600}
            itemSize={50}
            style={{ overflow: 'hidden' }}
            itemCount={
              textFilter.length > 0
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
      if (TypesUtils.isPlaylistEntryArray(data)) return true;
      return false;
    }

    handleOnTextFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
      this.setState({ textFilter: e.currentTarget.value });
    };

    handleFilter = (textFilter: string) => {
      this.setState({ textFilter });
    };

    render() {
      if (this.dataExists()) {
        const {
          filterHidden,
          headerHidden,
          addedHidden,
          showPlayingFrom,
          data,
        } = this.props;
        const { textFilter } = this.state;
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
                    value={textFilter}
                    onChange={this.handleOnTextFilterChange}
                  />
                  {textFilter.length > 0 && (
                    <RiIcons.RiCloseLine
                      className="ClearButton"
                      onClick={() => {
                        this.handleFilter('');
                      }}
                    />
                  )}
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
                    {!addedHidden && !showPlayingFrom && (
                      <div>
                        <BiIcons.BiCalendarAlt
                          className={ButtonsClassNames.Icon}
                        />
                      </div>
                    )}
                    {showPlayingFrom && 'FROM'}
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
