const HappyHomes = require('../models/HappyHome')
const os = require('os');
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
      console.log(req.headers.host)
      res.render("map.ejs", {locations: locations, googlemapsapikey: process.env.GOOGLEMAPS_API_KEY, hostname: req.headers.host});
    },
    getCoordinates: async (req, res) => {
      try {
        HappyHomes.createIndexes({location: "2dsphere"})
        const lat = req.params.latitude;
        const lng = req.params.longitude;
        if(lat > 90 || lat < -90) { 
          res.send("Invalid Latitude.");
          return;
        }
        if(lng > 180 || lng < -180) {
          res.send("Invalid Longitude");
          return;
        }
        const locations = await HappyHomes.find({
          location: {
            $geoWithin: {
              $centerSphere: 
              [[lng, lat], 10 / 3963.2]
            }
            /*
            $near: {
              $geometry: {type: "Point", coordinates: [-121.99954359299791, 37.31869993712429 ]},
              $minDistance: 1,
              $maxDistance: 500
            }*/
            
          }
        });
        let string = "";
        string += `Latitude: ${req.params.latitude}<br>`
        string += `Longitude: ${req.params.longitude}`
        res.json(locations)
      }
      catch(error) {
        console.log("Error");
        console.log(error)
        res.json({error: error})
      }
    },
    getCoordinatesRadius: async (req, res) => {
      try {
        HappyHomes.createIndexes({location: "2dsphere"})
        const lat = req.params.latitude;
        const lng = req.params.longitude;
        const rad = req.params.radius;
        if(lat > 90 || lat < -90) { 
          res.send("Invalid Latitude.");
          return;
        }
        if(lng > 180 || lng < -180) {
          res.send("Invalid Longitude");
          return;
        }
        const locations = await HappyHomes.find({
          location: {
            $geoWithin: {
              $centerSphere: 
              [[lng, lat], rad / 3963.2]
            }
            /*
            $near: {
              $geometry: {type: "Point", coordinates: [-121.99954359299791, 37.31869993712429 ]},
              $minDistance: 1,
              $maxDistance: 500
            }*/
            
          }
        });
        let string = "";
        string += `Latitude: ${req.params.latitude}<br>`
        string += `Longitude: ${req.params.longitude}`
        res.json(locations)
      }
      catch(error) {
        console.log("Error");
        console.log(error)
        res.json({error: "Error finding stuff"})
      }
    } 
  };
  