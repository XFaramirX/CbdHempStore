import React from 'react';
import { linkTo } from '@storybook/addon-links';
import Badge from './Badge';
import GridItem from '../../components/Grid/GridItem';
import { makeStyles } from '@material-ui/core/styles';

import styles from '../../assets/jss/nextjs-material-kit/pages/componentsSections/basicsStyle.js';

const useStyles = makeStyles(styles);

export default {
  title: 'Badge',
  component: Badge,
};
export const Types = () => {
  const classes = useStyles();

  return (
    <GridItem xs={12} sm={12} md={6}>
      <div className={classes.title}>
        <h3>Badges</h3>
      </div>
      <Badge>default</Badge>
      <Badge color="primary">primary</Badge>
      <Badge color="info">info</Badge>
      <Badge color="success">success</Badge>
      <Badge color="warning">warning</Badge>
      <Badge color="danger">danger</Badge>
      <Badge color="rose">rose</Badge>
    </GridItem>
  );
};
