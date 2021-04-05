import React from 'react';
// import Carousel, { Dots, slidesToShowPlugin } from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';
import PageTitle from '../components/PageTitle';

const RecentlyPlayed: React.FC = () => {
  return (
    <div>
      <div className="Home">
        <PageTitle PageName="Recently Played" />

        {/* <Carousel
          // display="flex"
          // justify-content="space-between"
          // align-items="center"
          plugins={[
            'arrows',
            {
              resolve: slidesToShowPlugin,
              options: {
                numberOfSlides: 4,
              },
            },
          ]}
        >
          <div style={{ float: 'left' }}>
            <figure style={{ float: 'left' }}>
              <img
                src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
                alt="test"
              />
              <figcaption>
                <a href="http">Lana Del Rey</a>
                <p>ARTIST</p>
              </figcaption>
            </figure>
          </div>
          <div style={{ float: 'left' }}>
            <figure style={{ float: 'left' }}>
              <img
                src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
                alt="test"
              />
              <figcaption>
                <a href="http">Lana Del Rey</a>
                <p>ARTIST</p>
              </figcaption>
            </figure>
          </div>
          <div style={{ float: 'left' }}>
            <figure style={{ float: 'left' }}>
              <img
                src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
                alt="test"
              />
              <figcaption>
                <a href="http">Lana Del Rey</a>
                <p>ARTIST</p>
              </figcaption>
            </figure>
          </div>
        </Carousel> */}

        <div className="Card">
          <div style={{ float: 'left' }}>
            <figure style={{ float: 'left' }}>
              <img
                src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
                alt="test"
              />
              <figcaption>
                <a href="http">Lana Del Rey</a>
                <p>ARTIST</p>
              </figcaption>
            </figure>
          </div>
          <div style={{ float: 'left' }}>
            <figure style={{ float: 'left' }}>
              <img
                src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
                alt="test"
              />
              <figcaption>
                <a href="http">Lana Del Rey</a>
                <p>ARTIST</p>
              </figcaption>
            </figure>
          </div>
          <div style={{ float: 'left' }}>
            <figure style={{ float: 'left' }}>
              <img
                src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
                alt="test"
              />
              <figcaption>
                <a href="http">Lana Del Rey</a>
                <p>ARTIST</p>
              </figcaption>
            </figure>
          </div>
          <div style={{ float: 'left' }}>
            <figure style={{ float: 'left' }}>
              <img
                src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
                alt="test"
              />
              <figcaption>
                <a href="http">Lana Del Rey</a>
                <p>ARTIST</p>
              </figcaption>
            </figure>
          </div>
          <div style={{ float: 'left' }}>
            <figure style={{ float: 'left' }}>
              <img
                src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
                alt="test"
              />
              <figcaption>
                <a href="http">Lana Del Rey</a>
                <p>ARTIST</p>
              </figcaption>
            </figure>
          </div>
          <div style={{ float: 'left' }}>
            <figure style={{ float: 'left' }}>
              <img
                src="https://github.com/morpheusthewhite/spicetify-themes/raw/master/Dribbblish/base.png"
                alt="test"
              />
              <figcaption>
                <a href="http">Lana Del Rey</a>
                <p>ARTIST</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyPlayed;
