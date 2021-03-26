import React from 'react';
import PageTitle from '../components/PageTitle';

const RecentlyPlayed: React.FC = () => {
  return (
    <div>
      <div className="Home">
        <PageTitle PageName="Recently Played" />

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

export default RecentlyPlayed;
