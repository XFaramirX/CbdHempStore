import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#00bcd4',
      dark: '#008394',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff',
    },
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    // Style sheet name ⚛️
    MuiButton: {
      // Name of the rule
      h1: {
        // Some CSS
        color: 'red',
      },
    },
  },
});

export default function Landing(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
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
          </GridContainer>
        </div>
      </Parallax>

      <MuiThemeProvider theme={theme}>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <SectionTypography />
        </div>
      </MuiThemeProvider>

      <Footer />
    </div>
  );
}
