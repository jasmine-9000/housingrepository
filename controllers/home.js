module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
  getCredits: (req, res) => {
    res.render("credits.ejs");
  },
  getContact: (req, res) => {
    res.render("contact.ejs");
  },
  getContribute: (req, res) => {
    res.render("contribute.ejs");
  },
  getAbout: (req, res) => {
    res.render("about.ejs");
  }
};
