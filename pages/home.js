import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import { Provider } from 'react-redux';
import store from '../src/lib/redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import LightTheme from '../themes/light-theme.js';
import DarkTheme from '../themes/dark-theme.js';

import SectionTypography from 'pages-sections/Components-Sections/SectionTypography.js';
// nodejs library that concatenates classes
import classNames from 'classnames';
// react components for routing our app without refresh
import Link from 'next/link';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/icons
// core components
import Header from 'components/Header/Header.js';
import HeaderLinks from 'components/Header/HeaderLinks.js';

import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Parallax from 'components/Parallax/Parallax.js';

import Footer from 'components/Footer/Footer.js';

import styles from 'assets/jss/nextjs-material-kit/pages/components.js';

const useStyles = makeStyles(styles);

const theme = createMuiTheme(DarkTheme);

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: DarkTheme,
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
      <MaterialNext
        theme={this.state.theme}
        onClick={() => this.changeTheme()}
      ></MaterialNext>
    );
  }
}

function MaterialNext(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
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
        <Parallax image={require('assets/img/nextjs_header.jpg')}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem>
                <div className={classes.brand}>
                  <h1 className={classes.title}>NextJS Material Kit.</h1>
                  <h3 className={classes.subtitle}>
                    A Badass Material Kit based on Material-UI and NextJS.
                  </h3>
                </div>
              </GridItem>
              <GridItem>
                <h1>TEST</h1>
                <div>
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
                    <Button
                      variant="contained"
                      color="primary"
                      href="#contained-buttons"
                    >
                      Link
                    </Button>
                  </MuiThemeProvider>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>

        <MuiThemeProvider theme={theme}>
          <div className={classNames(classes.main, classes.mainRaised)}>
            <SectionTypography />
          </div>
        </MuiThemeProvider>
        <style jsx global>{`
          h1 {
            color: red;
          }
        `}</style>
        <Footer />
      </Provider>
    </div>
  );
}

export default Layout;
