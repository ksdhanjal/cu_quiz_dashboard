module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        "login": 'url(/images/login-bg.jpeg)',
      },
      colors: {
        'primary': '#E40D1C',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
