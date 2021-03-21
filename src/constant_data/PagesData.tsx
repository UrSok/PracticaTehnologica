import React from 'react';
import * as BsIcons from 'react-icons/bs';

const PagesData = [
  {
    key: 'home',
    title: 'Home',
    path: '/',
    icon: <BsIcons.BsHouse />,
    iconActive: <BsIcons.BsHouseFill />,
  },
  {
    key: 'test',
    title: 'Test',
    path: '/test',
    icon: <BsIcons.BsImage />,
    iconActive: <BsIcons.BsImageFill />,
  },
];

export default PagesData;
