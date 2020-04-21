import React from 'react';
import { linkTo } from '@storybook/addon-links';
import HelloWorld from './helloWorld';

export default {
  title: 'Test',
  component: HelloWorld,
};

export const ToStorybook = () => <HelloWorld showApp={linkTo('Button')} />;

ToStorybook.story = {
  name: 'to Storybook',
};
