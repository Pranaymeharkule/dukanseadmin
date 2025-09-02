/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [   
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
   theme: {
    extend: {
      colors: {
        brandYellow: '#FEBC1D',
        brandRed: '#EC2D01'
      },
      
    },
  },
  plugins: [],
};
