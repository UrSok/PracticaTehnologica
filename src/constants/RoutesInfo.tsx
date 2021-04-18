import React from 'react';
import * as BsIcons from 'react-icons/bs';
import * as RiIcons from 'react-icons/ri';

interface PageData {
  key: string;
  title: string;
  path: PathData;
  icon?: JSX.Element;
  iconActive?: JSX.Element;
}

export enum PathData {
  MainLibrary = '/mainlibrary',
  Playlist = '/playlist',
  Queue = '/queue',
  Settings = '/settings',
}

export enum PageTitle {
  MainLibrary = 'Main Library',
  Playlist = 'Playlist',
  Queue = 'Queue',
  Settings = 'Settings',
}

export const PagesData: PageData[] = [
  {
    key: 'mainLibrary',
    title: PageTitle.MainLibrary,
    path: PathData.MainLibrary,
    icon: <BsIcons.BsCollectionPlay />,
    iconActive: <BsIcons.BsCollectionPlayFill />,
  },
];

export const QueuePage: PageData = {
  key: 'queue',
  title: PageTitle.Queue,
  path: PathData.Queue,
};

export const SettingsPage: PageData = {
  key: 'settings',
  title: PageTitle.Settings,
  path: PathData.Settings,
  icon: <RiIcons.RiSettings3Line />,
  iconActive: <RiIcons.RiSettings3Fill />,
};

export const PlaylistPage: PageData = {
  key: 'playlists',
  title: PageTitle.Playlist,
  path: PathData.Playlist,
  icon: <BsIcons.BsCircle />,
  iconActive: <BsIcons.BsCircleFill />,
};
