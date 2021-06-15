module.exports = {
  plugins: [
    require('tailwindcss'),
    require('postcss-nested'), // or require('postcss-nesting')
    require('postcss-custom-properties'),
    require('autoprefixer'),
  ]
}