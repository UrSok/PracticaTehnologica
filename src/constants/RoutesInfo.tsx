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
  Artists = '/artists',
  Queue = '/queue',
  Settings = '/settings',
}

export const PagesData: PageData[] = [
  {
    key: 'home',
    title: 'Home',
    path: PathData.Home,
    icon: <BsIcons.BsHouse />,
    iconActive: <BsIcons.BsHouseFill />,
  },
  {
    key: 'recentlyPlayed',
    title: 'Recently Played',
    path: PathData.RecentlyPlayed,
    icon: <BsIcons.BsClock />,
    iconActive: <BsIcons.BsClockFill />,
  },
  {
    key: 'mainLibrary',
    title: 'Main Library',
    path: PathData.MainLibrary,
    icon: <BsIcons.BsCollectionPlay />,
    iconActive: <BsIcons.BsCollectionPlayFill />,
  },
  {
    key: 'albums',
    title: 'Albums',
    path: PathData.Albums,
    icon: <RiIcons.RiDiscLine />,
    iconActive: <RiIcons.RiDiscFill />,
  },
  {
    key: 'artists',
    title: 'Artists',
    path: PathData.Artists,
    icon: <BsIcons.BsPerson />,
    iconActive: <BsIcons.BsPersonFill />,
  },
  {
    key: 'settings',
    title: 'Settings',
    path: PathData.Settings,
    icon: <RiIcons.RiSettings3Line />,
    iconActive: <RiIcons.RiSettings3Fill />,
  },
];

export const QueuePage: PageData = {
  key: 'queue',
  title: 'Queue',
  path: PathData.Queue,
};
