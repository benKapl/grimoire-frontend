/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        spellbook:
          "url('https://static.wikia.nocookie.net/crossroads/images/f/f5/Grimoire_de_Ma%C3%AEtre.png/revision/latest?cb=20170325200219&path-prefix=fr')".replace(
            /'/g,
            '%27'
          ),
        'backImg-signup': "url('/assets/backimage-signup.png')",
        'backImg-signin': "url('/assets/backimage-signin.png')",
        'backImg-settings': "url('/assets/backimage-settings.png')",
      },
      colors: {
        tagColor: '#E2EAED',
        darkPurple: '#462888',
        backgroundColor: '#F5F7FB',
        lightPurple: '#C5CAE3',
        white: '#F8FAFA',
        whitePure: '#FFFFFF',
        black: '#272727',
        grey: '#A7A7A7',
      },
    },
  },
  plugins: [],
};
