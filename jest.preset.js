const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  transform: {
    'node_modules[\\\\/]@ckeditor.+\\.(js)$': 'babel-jest',
    '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$|@ckeditor)'],
};
