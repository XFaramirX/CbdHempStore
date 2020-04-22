import React from 'react';
import Badge from './Badge';
import GridItem from '../../components/Grid/GridItem';

export default {
  title: 'Badge',
  component: Badge,
};
export const Types = () => {
  return (
    <GridItem xs={12} sm={12} md={6}>
      <div>
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
