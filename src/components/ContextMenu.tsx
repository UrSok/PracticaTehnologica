/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
import { observer } from 'mobx-react';
import Scrollbars from 'rc-scrollbars';
import * as React from 'react';
import { Item, ItemParams, Menu, Submenu } from 'react-contexify';
import * as IoIosIcons from 'react-icons/io';
import {
  Music,
  PlayingFromType,
  PlaylistEntry,
  QueueEntry,
} from '../back-end/models';
import RootStore from '../back-end/store/RootStore';
import { PathData } from '../constants/RoutesInfo';
import Navigation from '../utils/Navigation';
import { StoreContext } from '../utils/StoreContext';
import TypesUtils from '../utils/TypesUtils';

export const MENU_ID = 1;

const ContextMenu = observer(
  class ContextMenu extends React.Component {
    handleQueueClick({ props }: ItemParams<any, any>) {
      const { entry, context } = props;
      const { queueStore } = context as RootStore;
      if (TypesUtils.isMusic(entry)) {
        queueStore.addPriorityQueue((entry as Music).id);
      }
      if (TypesUtils.isPlaylistEntry(entry)) {
        queueStore.addPriorityQueue(
          (entry as PlaylistEntry).musicId,
          PlayingFromType.Playlist,
          (entry as PlaylistEntry).playlistId
        );
      }
    }

    async handleCreatePlaylist({ props }: ItemParams<any, any>) {
      const { entry, context } = props;
      let musicId = 0;
      if (TypesUtils.isMusic(entry)) {
        musicId = (entry as Music).id;
      } else if (TypesUtils.isQueueEntry(entry)) {
        musicId = (entry as QueueEntry).musicId;
      } else if (TypesUtils.isPlaylistEntry(entry)) {
        musicId = (entry as PlaylistEntry).musicId;
      }
      if (musicId === 0) return;
      const { playlistStore } = context as RootStore;
      const resultId = await playlistStore.createPlaylist(musicId);
      if (resultId !== 0) Navigation.pushPlaylist(resultId);
    }

    handleAddToPlaylist({ props }: ItemParams<any, any>, playlistId: number) {
      const { entry, context } = props;
      let musicId = 0;
      if (TypesUtils.isMusic(entry)) {
        musicId = (entry as Music).id;
      } else if (TypesUtils.isQueueEntry(entry)) {
        musicId = (entry as QueueEntry).musicId;
      } else if (TypesUtils.isPlaylistEntry(entry)) {
        musicId = (entry as PlaylistEntry).musicId;
      }
      if (musicId === 0) return;
      const { playlistStore } = context as RootStore;
      const playlist = playlistStore.getById(playlistId);
      if (!playlist) return;
      playlist.addEntryIfDoesntExist(musicId);
    }

    handleRemoveFromPlaylist({ props }: ItemParams<any, any>) {
      const { entry, context } = props;
      const { playlistStore } = context as RootStore;
      if (TypesUtils.isPlaylistEntry(entry)) {
        (entry as PlaylistEntry).remove();
        if (
          playlistStore.getById((entry as PlaylistEntry).playlistId) ===
          undefined
        )
          Navigation.replace(PathData.MainLibrary);
      }
    }

    render() {
      const { playlistStore } = this.context as RootStore;
      return (
        <Menu
          id={MENU_ID}
          theme="dark"
          animation="slide"
          style={{ zIndex: 9999 }}
        >
          <Item onClick={this.handleQueueClick}>Add to Queue</Item>
          {Navigation.currentLocationIsPlaylist && (
            <Item onClick={this.handleRemoveFromPlaylist}>
              Remove from this Playlist
            </Item>
          )}
          <Submenu
            label="Add to Playlist"
            arrow={<IoIosIcons.IoIosArrowForward className="Icon" />}
          >
            <Item onClick={this.handleCreatePlaylist}>
              New Playlist
              <IoIosIcons.IoIosAdd className="Icon" />
            </Item>
            {playlistStore.playlists.map((playlist) => {
              const { id, name } = playlist;
              return (
                <Item
                  key={id}
                  onClick={(params: ItemParams<any, any>) => {
                    this.handleAddToPlaylist(params, id);
                  }}
                >
                  {name}
                </Item>
              );
            })}
          </Submenu>
        </Menu>
      );
    }
  }
);
ContextMenu.contextType = StoreContext;

export default ContextMenu;
