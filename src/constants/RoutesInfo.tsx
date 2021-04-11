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
  Home = '/',
  RecentlyPlayed = '/recently',
  MainLibrary = '/mainlibrary',
  Albums = '/albums',
  // Artists = '/artists',
  Queue = '/queue',
  Settings = '/settings',
}

export enum PageTitle {
  Home = 'Home',
  RecentlyPlayed = 'Recently Played',
  MainLibrary = 'Library',
  // Albums = 'Albums',
  // Artists = 'Artists',
  Queue = 'Queue',
  Settings = 'Settings',
}

export const PagesData: PageData[] = [
  {
    key: 'home',
    title: PageTitle.Home,
    path: PathData.Home,
    icon: <BsIcons.BsHouse />,
    iconActive: <BsIcons.BsHouseFill />,
  },
  {
    key: 'recentlyPlayed',
    title: PageTitle.RecentlyPlayed,
    path: PathData.RecentlyPlayed,
    icon: <BsIcons.BsClock />,
    iconActive: <BsIcons.BsClockFill />,
  },
  {
    key: 'mainLibrary',
    title: PageTitle.MainLibrary,
    path: PathData.MainLibrary,
    icon: <BsIcons.BsCollectionPlay />,
    iconActive: <BsIcons.BsCollectionPlayFill />,
  },
  /* {
    key: 'albums',
    title: PageTitle.Albums,
    path: PathData.Albums,
    icon: <RiIcons.RiDiscLine />,
    iconActive: <RiIcons.RiDiscFill />,
  },
  {
    key: 'artists',
    title: PageTitle.Artists,
    path: PathData.Artists,
    icon: <BsIcons.BsPerson />,
    iconActive: <BsIcons.BsPersonFill />,
  }, */
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
