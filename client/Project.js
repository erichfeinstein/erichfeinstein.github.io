import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
  Grow,
} from '@material-ui/core';

const styles = {
  card: {
    raised: true,
    margin: '2.5vw',
    borderRadius: '0px',
  },
  media: {
    height: 140,
    paddingTop: '60%',
  },
  content: {
    margin: '0px',
  },
};

class Project extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: false,
    };
  }
  render() {
    const {
      title,
      description,
      image,
      github,
      googleplay,
      link,
      classes,
    } = this.props;
    return (
      <Grow direction="up" in={true}>
        <div className="project">
          <Card className={classes.card} style={{ backgroundColor: '#222222' }}>
            <CardMedia className={classes.media} image={image} />
            <CardContent className={classes.content}>
              <Typography gutterBottom variant="h4">
                {title}
              </Typography>
              {description.map(section => (
                <div>
                  <Typography variant="subtitle1">{section}</Typography>
                  <br />
                </div>
              ))}
              {github || googleplay || link ? (
                <div align="right">
                  <hr />
                  {googleplay ? (
                    <Button onClick={() => window.open(googleplay)}>
                      <img
                        className="small-icon"
                        src="images/icons/gplay-white.png"
                      />
                    </Button>
                  ) : null}
                  {github ? (
                    <IconButton onClick={() => window.open(github)}>
                      <img
                        className="small-icon"
                        src="images/icons/github.png"
                      />
                    </IconButton>
                  ) : null}
                  {link ? (
                    <IconButton onClick={() => window.open(link)}>
                      <img className="small-icon" src="images/icons/open.png" />
                    </IconButton>
                  ) : null}
                  <hr />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </Grow>
    );
  }
}

export default withStyles(styles)(Project);
