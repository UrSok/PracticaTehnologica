import React from 'react';
// import Grid from '@material-ui/core/Grid';
// import GridLayout from 'react-grid-layout';
import PageTitle from '../components/PageTitle';

const Home: React.FC = () => {
  return (
    <div>
      {/* <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
      > */}
      <div className="Home">
        <PageTitle PageName="Home" />
        <p>Hot new releases</p>
        <div className="Card">
          <div>
            <img
              width="250"
              height="250"
              src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
              alt="test"
            />
          </div>
          <div>
            <img
              width="250"
              height="250"
              src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
              alt="test"
            />
          </div>
          <div>
            <img
              width="250"
              height="250"
              src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
              alt="test"
            />
          </div>
          <div>
            <img
              width="250"
              height="250"
              src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
              alt="test"
            />
          </div>
          <div>
            <img
              width="250"
              height="250"
              src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
              alt="test"
            />
          </div>
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
      {/* </Grid> */}
    </div>
  );
};

export default Home;
