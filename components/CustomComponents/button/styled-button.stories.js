import React from 'react';

import { action } from '@storybook/addon-actions';

import RegularButton from './styled-button';

export default {
  title: 'Styled Button',
};

export const Default = () => (
  <RegularButton onClick={action('Styled button clicked')}>
    Styled Button
  </RegularButton>
);
