/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/.{html, js, css}",
            "./views/*.ejs",
            "./views/partials/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {}
    }
  ],
}
