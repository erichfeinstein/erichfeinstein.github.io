import React from 'react';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import AboutPage from './AboutPage';
import Home from './Home';
import LandingPage from './LandingPage';
import ResumePage from './ResumePage';

export default class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 3,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleResume = this.handleResume.bind(this);
  }

  render() {
    const { value } = this.state;
    return (
      <div>
        <AppBar className="bar" position="sticky" dir="ltr">
          <Tabs
            style={{ height: '5vh' }}
            value={value}
            dir="rtl"
            onChange={this.handleChange}
          >
            <Tab className="tab" label="Resume" />
            <Tab className="tab" label="About" />
            <Tab className="tab" label="Projects" />
            <Tab className="tab" label="Eric Feinstein" />
          </Tabs>
        </AppBar>
        {value === 3 && <LandingPage />}
        {value === 2 && <Home />}
        {value === 1 && <AboutPage />}
        {value === 0 && <ResumePage />}
      </div>
    );
  }

  handleResume = () => {
    window.open('/documents/EricFeinsteinResume2018.pdf');
    this.setState({
      value: 3,
    });
  };

  handleChange = (event, value) => {
    event.preventDefault();
    this.setState({ value });
  };
}
