import React from 'react';
import { Fade } from '@material-ui/core';
import Project from './Project';
import Footer from './Footer';

import { projects } from './projects';

export default class Home extends React.Component {
  render() {
    return (
      <Fade in={true}>
        <div>
          <div id="main-content">
            <div id="project-cols">
              {projects.map(project => (
                <Project
                  id={project.id}
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  github={project.github}
                  googleplay={project.googleplay}
                  link={project.link}
                />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </Fade>
    );
  }
}
