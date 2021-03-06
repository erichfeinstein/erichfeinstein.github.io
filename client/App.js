import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

//Components
import NavBar from './NavBar';
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: '"Montserrat", sans-serif',
  },
  palette: {
    primary: {
      main: '#121212',
    },
    type: 'dark',
  },
});

export default class App extends React.Component {
  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar value={2} />
        </MuiThemeProvider>
      </div>
    );
  }
}
