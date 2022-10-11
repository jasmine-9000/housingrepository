const cloudinary = require('../middleware/cloudinary');
const HappyHome = require('../models/HappyHome');
const Comment = require('../models/Comment');
HappyHome.createIndexes({location: "2dsphere"})

const HappyHomeOptions = [
  'autismfriendly',
  'dogfriendly',
  'housingvouchers',
  'affordablehousing',
  'consumerowned',
  'communitygarden',
  'petsallowed',
  'videomonitoring',
  'lgbtqplusfriendly'
]
module.exports = {
  getProfile: async (req, res) => {
    try {
      const happyHomes = await HappyHome.find({ user: req.user.id });
      res.render('profile.ejs', { happyHomes: happyHomes, user: req.user, googlemapsgeocodingAPIkey: process.env.GOOGLEMAPS_GEOCODING_API_KEY});
    } catch (err) {
      console.log(err);
    }
  },
  getHappyHome: async (req, res) => {
    try {
      const happyhome = await HappyHome.findById(req.params.id);
      const comments = await Comment.find({ happyhome: req.params.id })
        .populate('user', 'userName')
        .sort({ createdAt: 'desc' })
        .lean();
        console.log(comments);
        
      res.render('happyhome.ejs', {
        happyhome: happyhome,
        user: req.user,
        comments: comments,
        happyhomeoptions: HappyHomeOptions
      });

    } catch (err) {
      console.log(err);
    }
  },
  getHappyHomeNoAuth: async (req, res) => {
    try {
      const happyhome = await HappyHome.findById(req.params.id);
      
      const comments = await Comment.find({ happyhome: req.params.id })
        .populate('user', 'userName')
        .sort({ createdAt: 'desc' })
        .lean();
        console.log(comments);
      res.render('happyhome.ejs', {
        happyhome: happyhome,
        user: {id: 0},
        comments: comments,
        happyhomeoptions: HappyHomeOptions
      });
    } catch (err) {
      console.log(err);
    }
  },
  createHappyHome: async (req, res) => {
    try {
      const coords = [
        // in MongoDB, type POINT has longitude first.
        req.body.longitude,
        req.body.latitude
      ]
      if(req.file) {
        
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        
        await HappyHome.create({
          name: req.body.name,
          image: result.secure_url,
          cloudinaryId: result.public_id,
          address: req.body.address,
          location: {
            type: 'Point',
            coordinates: coords
          },
          /*
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          */
          likes: 0,
          user: req.user.id,
          options: {
            autismfriendly: req.body.autismfriendly,
            dogfriendly: req.body.dogfriendly,
            housingvoucher: req.body.housingvoucher,
            affordablehousing: req.body.affordablehousing,
            communitygarden: req.body.communitygarden,
            petsallowed: req.body.petsallowed,
            videomonitoring: req.body.videomonitoring
          }
        })
      } else {
          console.log("No image provided...");
          console.log("[Latitude, Longitude]: ")
          console.log(coords)
          await HappyHome.create({
            name: req.body.name,
            image: "",
            cloudinaryId: "",
            address: req.body.address,
            /*
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            */
            location: {
              type: 'Point',
              coordinates: coords
            },
            likes: 0,
            user: req.user.id,
            options: {
              autismfriendly: req.body.autismfriendly,
              dogfriendly: req.body.dogfriendly,
              housingvoucher: req.body.housingvoucher,
              affordablehousing: req.body.affordablehousing,
              communitygarden: req.body.communitygarden,
              petsallowed: req.body.petsallowed,
              videomonitoring: req.body.videomonitoring
            }
          })
      }
      console.log('Post has been added!');
      res.redirect('/profile');
    } catch (err) {
      console.log(err);
      res.send("Error handling form...")
    }
  },
  likeHappyHome: async (req, res) => {
    try {
      await HappyHome.findOneAndUpdate(
        // find post to update by ID,
        { _id: req.params.id },
        {
          $inc: { likes: 1 }, // and increment by 1
        }
      );
      console.log('Likes +1');
      res.redirect(`/happyHome/${req.params.id}`); // Redirect back to post page
    } catch (err) {
      console.log(err);
    }
  },
  deleteHappyHome: async (req, res) => {
    console.log("meow")
    const fetchID = req.params.id
      console.log(fetchID);
    try {
      
      // Find post by id
      let post = await HappyHome.findById({ _id: fetchID });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await HappyHome.remove({ _id: fetchID });
      console.log('Deleted Post');
      res.redirect('/profile');
    } catch (err) {
      res.redirect('/profile');
    }
  },
  editHappyHome: async (req, res) => {
    const fetchID = req.params.id
    console.log(fetchID);
    try {
      let happyhome = await HappyHome.findById({ _id: fetchID });
      console.log(happyhome);
      res.render("edithappyhome", {happyhome: happyhome})
    } catch(err) {
      console.log(err);
      res.redirect('/happyHome/' + req.params.id)
    }
  }
};
