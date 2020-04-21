import React from 'react';

import { action } from '@storybook/addon-actions';

import SectionExamples from './SectionExamples.js';

export default {
  title: 'SectionExamples',
};

export const Default = () => (
  <SectionExamples onClick={action('Styled button clicked')}>
    SectionExamples
  </SectionExamples>
);
