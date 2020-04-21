import { addParameters } from '@storybook/react';
import '../public/static/styles.css';
import viewportsCustom from './viewports';

addParameters({
  viewport: { viewports: viewportsCustom },
  notes: 'global notes',
});
