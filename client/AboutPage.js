import React from 'react';
import { Typography, Fade, Grow } from '@material-ui/core';
import Footer from './Footer';

export default class AboutCard extends React.Component {
  render() {
    return (
      <Fade in={true}>
        <div className="layout">
          <div id="about-content">
            <div id="about-content-main">
              <img src="/images/headshot.JPG" />
              <div id="about-content-title">
                <Typography align="left" variant="h2">
                  Eric Feinstein
                </Typography>
                <Typography align="left" variant="h6">
                  Software Developer in New York City
                </Typography>
                <hr />
                <Typography align="left" variant="subtitle1">
                  Bachelor of Arts in Computer Science
                </Typography>
                <Typography align="left" variant="subtitle1">
                  Case Western Reserve University
                </Typography>
              </div>
            </div>
            <Grow timeout={700} in={true}>
              <div id="about-text">
                <Typography align="right" variant="h2">
                  About Me
                </Typography>
                <hr />
                <Typography variant="h6">
                  I am a recent graduate of Case Western Reserve University in
                  Cleveland, OH, with a major in Computer Science and a minor in
                  Music. I am seeking a full-time position in software
                  engineering, with interest in web development and mobile app
                  development in media. I am proficient in the industry's most
                  commonly used programming languages, including Java,
                  JavaScript, C#, Swift and others.
                </Typography>
                <br />
                <Typography variant="h6">
                  I have developed a few mobile applications, including MunchBox
                  and MusiQuest, and I directed a group of 13 programmers and 6
                  artists to develop an online multiplayer game: Fight or
                  Fright.
                </Typography>
                <br />
                <Typography variant="h6">
                  During my undergraduate career at Case Western, I was an
                  active member of Case Men's Glee Club, in which I held several
                  positions over four years. The group has grown four times in
                  size since I joined, and is now offered through Case Western
                  Reserve University's Music Department.
                </Typography>
                <br />
                <Typography variant="h6">
                  In my free time, I also like to write and produce original
                  music of a variety of genres and metal covers. My original
                  music is published on Spotify, Apple Music, and other popular
                  streaming platforms, and some of my metal covers have garnered
                  praise among specific communities.
                </Typography>
              </div>
            </Grow>
          </div>
          <Footer />
        </div>
      </Fade>
    );
  }
}
