const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: 'class',
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    './node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#1475bd',
        secondaryColor: '#1eade9',
        'base-gray': '#f3f5f7',
        'base-gray-dark': '#181a23',
        'main-dark': '#1f222a',
        'dark-text': '#ebebeb',
        'light-text': '#030712',
      },
      boxShadow: {
        'light-shadow': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'dark-shadow': '10px 10px 19px #1c1e22, -10px -10px 19px #262a2e',
      },
    },
  },
  plugins: [require('preline/plugin'), require('tailwindcss-animated')],
};
