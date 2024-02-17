/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
        colors: {
            // Blues        
            "navy": "#172A3A",
            "blue": "#395c6b",
            "mid-blue": "#1C495C",
            // Grayscale
            "light-grey": "#E8E8E8",
            "grey": "#5f5f5f",
            "dark-grey": "#212529",
            "off-white": "#fbf7f5",
            "beige": "#F7EDE2",
            "soft-black": "#0e1111",
            // Yellows
            "light-yellow": "#F3ECD2",
            "yellow": "#E4C891",
            "dark-yellow": "#f1b640",
            // Other
            "red": "#E07A5F",
            "green": "#9FB798",
        }
    },
  },
  plugins: [],
}

