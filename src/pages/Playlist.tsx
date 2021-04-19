/* eslint-disable eqeqeq */
import React from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react';
import { PagesClassNames } from '../constants/ClassNames';
import { useRootStore } from '../utils/StoreContext';
import PlaylistHeader from '../components/PlaylistHeader';
import RootStore from '../back-end/store/RootStore';
import { PlayingFromType } from '../back-end/models';
import ScrollToTop from '../components/ScrollToTop';
import DataList from '../components/DataList';

const Playlist: React.FC = observer(() => {
  const { musicStore, playlistStore } = useRootStore() as RootStore;
  const { id } = useParams();
  const playlist = playlistStore.playlists.find((x) => x.id == id);
  if (!playlist) return null;
  return (
    <div className={PagesClassNames.Playlist}>
      <ScrollToTop />
      <PlaylistHeader playlist={playlist} />
      <DataList data={playlist.entries} handleOnPlay={() => {}} />
    </div>
  );
});

export default Playlist;
