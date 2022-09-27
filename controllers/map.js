const HappyHomes = require('../models/HappyHome')

module.exports = {
    getMap: async (req, res) => {
      const locations = await HappyHomes.find({}); 
      let base = "/happyHome/"
      if(!req.isAuthenticated()) {
        base += "noauth/";
      }
      locations.forEach(location => {
        console.log("Location lat and long: ", location)
        location.link = base + location._id;
      })
      /*const locations = [
        {
            name: "Shire house",
            address: "2903 W Ashby Pl, San Antonio, TX 78228",
            link: "/happyHome/6328f433a2a8335174b67c15"
        }
      ]; */
      res.render("map.ejs", {locations: locations, googlemapsapikey: process.env.GOOGLEMAPS_API_KEY});
    }
  };
  