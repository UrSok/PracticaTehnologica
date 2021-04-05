import React from 'react';
import PageTitle from '../components/PageTitle';
import { PagesClassNames } from '../constants/ClassNames';

const Queue: React.FC = () => {
  return (
    <div>
      <div className={PagesClassNames.Queue}>
        <PageTitle PageName="Queue" />
        <div className="Card">
          <div>
            <img
              width="250"
              height="250"
              src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
              alt="test"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queue;
