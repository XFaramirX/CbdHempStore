import React, { Component } from 'react';

import { Provider } from 'react-redux';
import store from '../src/lib/redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import LightTheme from '../themes/light-theme.js';
import DarkTheme from '../themes/dark-theme.js';

import Header from 'components/Header/Header.js';
import HeaderLinks from 'components/Header/HeaderLinks.js';
import Button from 'components/CustomButtons/Button.js';

const theme = createMuiTheme(DarkTheme);

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: theme,
    };
  }

  changeTheme() {
    const theme = this.state.theme.name;
    if (theme === 'Dark Theme') {
      this.setState({ theme: LightTheme });
    } else {
      this.setState({ theme: DarkTheme });
    }
  }
  render() {
    return (
      <div>
        {' '}
        <MaterialNext
          theme={this.state.theme}
          onClick={() => this.changeTheme()}
        ></MaterialNext>
      </div>
    );
  }
}

function MaterialNext(props) {
  const { ...rest } = props;
  return (
    <div>
      <MuiThemeProvider theme={props.theme}>
        <MuiThemeProvider theme={props.theme}>
          <Button variant="contained" onClick={props.onClick}>
            Default
          </Button>
          <Button variant="contained" color="primary">
            Primary
          </Button>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
          <Button variant="contained" disabled>
            Disabled
          </Button>
          <Button variant="contained" color="primary" href="#contained-buttons">
            Link
          </Button>
        </MuiThemeProvider>
        <Provider store={store}>
          <Header
            brand="NextJS Material Kit"
            rightLinks={<HeaderLinks />}
            fixed
            color="transparent"
            changeColorOnScroll={{
              height: 400,
              color: 'white',
            }}
            {...rest}
          />
        </Provider>
      </MuiThemeProvider>
    </div>
  );
}

export default Layout;
