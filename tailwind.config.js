/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    // This tells Tailwind to scan all your HTML files for CSS classes
    "./templates/**/*.html",
    "./static/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // This is your new "unique" color scheme!
        // We are using Emerald as the primary color.
        primary: {
          DEFAULT: colors.emerald[600],
          ...colors.emerald,
        },
        // Using neutral grays (zinc) for a clean, modern look
        neutral: colors.zinc,
      }
    },
  },
  // This plugin helps style forms nicely
  plugins: [
    require('@tailwindcss/forms'),
  ],
};