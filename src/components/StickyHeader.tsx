import React from 'react';
import * as BiIcons from 'react-icons/bi';
import * as FiIcons from 'react-icons/fi';
import { ButtonsClassNames } from '../constants/ClassNames';
import { PathData } from '../constants/RoutesInfo';
import Navigation from '../utils/Navigation';

interface Props {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const StickyHeader: React.FC<Props> = (props: Props) => {
  const { title, className, children } = props;
  return (
    <div className={`StickyHeader ${className}`}>
      <div className="Head">
        <h3 className="Title">{title}</h3>
        <div>{children}</div>
      </div>
      <div className="ListHead">
        <div className="LeftOptions">#</div>
        <div className="MusicInfo">TITLE</div>
        <div className="Album">ALBUM</div>
        <div className="Added">
          {Navigation.currentLocationIs(PathData.Queue) ? (
            'FROM'
          ) : (
            <BiIcons.BiCalendarAlt className={ButtonsClassNames.Icon} />
          )}
        </div>
        <div className="Duration">
          <FiIcons.FiClock className={ButtonsClassNames.Icon} />
        </div>
      </div>
    </div>
  );
};

StickyHeader.defaultProps = {
  className: '',
};

export default StickyHeader;
