import React from 'react';
import { Typography, Fade } from '@material-ui/core';
import { Fade as FadeShow } from 'react-slideshow-image';

const slideImages = ['images/slideshow/2.jpg', 'images/slideshow/5.jpg'];

const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  arrows: false,
};

export default class LandingPage extends React.Component {
  render() {
    return (
      <FadeShow id="slideshow" {...properties}>
        {slideImages.map(img => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div
              className="each-slide"
              style={{ backgroundImage: `url(${img})` }}
            >
              <Fade timeout={2500} in={true}>
                <div className="title-container">
                  <div className="title-text">
                    <Typography
                      align="right"
                      variant="h1"
                      style={{
                        fontSize: '8vw',
                      }}
                    >
                      Eric Feinstein
                    </Typography>
                    <Typography
                      align="right"
                      variant="h1"
                      style={{
                        fontSize: '4vw',
                      }}
                    >
                      Full-Stack Software Developer
                    </Typography>
                    <Typography
                      align="right"
                      variant="h1"
                      style={{
                        fontSize: '4vw',
                      }}
                    >
                      in New York City
                    </Typography>
                  </div>
                </div>
              </Fade>
            </div>
          );
        })}
      </FadeShow>
    );
  }
}
