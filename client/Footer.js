import React from 'react';
import { Typography, IconButton } from '@material-ui/core';

export default class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <div className="footer-text">
          <Typography variant="h4">Eric Feinstein</Typography>
          <Typography variant="h6">eric.feinstein@case.edu</Typography>
          <Typography variant="h6">914-255-5074</Typography>
        </div>
        <div className="footer-button-container" align="right">
          <IconButton
            onClick={() => window.open('https://github.com/erichfeinstein')}
          >
            <img className="icon" src="images/icons/github.png" />
          </IconButton>
          <IconButton
            onClick={() =>
              window.open(
                'https://www.linkedin.com/in/eric-feinstein-714658103'
              )
            }
          >
            <img className="icon" src="images/icons/linkedin.png" />
          </IconButton>
        </div>
      </div>
    );
  }
}
