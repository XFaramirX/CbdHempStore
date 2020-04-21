import { addParameters } from '@storybook/react';
import '../public/static/styles.css';
import viewportsCustom from './viewports';

import StylesDecorator from './styles-decorator';
import { addDecorator, configure } from '@storybook/react';

addDecorator(StylesDecorator);

addParameters({
  viewport: { viewports: viewportsCustom },
  notes: 'global notes',
});
