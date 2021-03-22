/* eslint-disable react/prop-types */
import React from 'react';

interface PageTitleProps {
  PageName: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ PageName }) => {
  return <h1>{PageName}</h1>;
};

export default PageTitle;
