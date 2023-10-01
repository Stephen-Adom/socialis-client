const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
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
      },
    },
  },
  plugins: [require('preline/plugin')],
};
