import { addParameters } from '@storybook/react';

import '../public/static/styles.css';
import viewportsCustom from './viewports';

import ThemeProvider from './theme-provider';
import { addDecorator, configure } from '@storybook/react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';

import LightTheme from '../themes/light-theme.js';
import DarkTheme from '../themes/dark-theme.js';

const themes = [LightTheme, DarkTheme];

addDecorator(withThemesProvider(themes, ThemeProvider));

addParameters({
  viewport: { viewports: viewportsCustom },
  notes: 'global notes',
});
