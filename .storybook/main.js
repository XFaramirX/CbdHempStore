module.exports = {
  stories: [
    '../components/**/**/*.stories.js',
    '../components/**/*.stories.js',
    '../pages-sections/**/*.stories.js',
  ],
  addons: [
    '@storybook/addon-viewport/register',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-actions/register',
    'storybook-addon-styled-component-theme/dist/register',
    '@storybook/addon-a11y/register',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
  webpackFinal: async (config) => {
    // do mutation to the config

    return config;
  },
};
