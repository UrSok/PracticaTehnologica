import React from 'react';
import * as BsIcons from 'react-icons/bs';

export enum PathData {
  Home = '/',
  Test = '/test',
}

export const PagesData = [
  {
    key: 'home',
    title: 'Home',
    path: PathData.Home,
    icon: <BsIcons.BsHouse />,
    iconActive: <BsIcons.BsHouseFill />,
  },
  {
    key: 'test',
    title: 'Test',
    path: PathData.Test,
    icon: <BsIcons.BsImage />,
    iconActive: <BsIcons.BsImageFill />,
  },
];
