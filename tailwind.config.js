/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
    daisyui: {
      themes: ["fantasy"],
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  
};

