module.exports = {
  stories: ['../components/**/**/*.stories.js'],
  addons: [
    '@storybook/addon-viewport/register',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-notes/register',
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