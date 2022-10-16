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
      let happyHome = await HappyHome.findById({ _id: fetchID });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(happyHome.cloudinaryId);
      // Delete post from db
      await HappyHome.remove({ _id: fetchID });
      console.log('Deleted Post');
      res.redirect('/profile');
    } catch (err) {
      res.redirect('/profile');
    }
  },
  deleteHappyHomeImage: async (req, res) => {
    const fetchID = req.params.id;
    try {
      let happyHome = await HappyHome.findById({_id: fetchID});

      await cloudinary.uploader.destroy(happyHome.cloudinaryId);

      happyHome.image = ""
      happyHome.cloudinaryId = "";
      await HappyHome.updateOne({_id: fetchID}, 
        {
          $set: 
            {
              image: "",
              cloudinaryId: ""
            }
      })
      res.redirect(`/happyHome/${fetchID}`)
    } catch(err) {
      console.log("Error occurred deleting only happy home image. Details: ");
      console.log(err);
      res.redirect(`/happyHome/${fetchID}`)
    }
  },
  uploadHappyHomeImage: async (req, res) => {
    res.redirect('/');
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
  },
  editHappyHomeWrite: async (req, res) => {
    const fetchID = req.params.id;
    // console.log(req.file)
    // console.log(req.body);
    let result;
    try {
      const happyHome = await HappyHome.findById({_id: fetchID})
      // console.log(happyHome)
      let newHappyHomeupdate = {}
      
      // do new image here
      if(req.file) {
          result = await cloudinary.uploader.upload(req.file.path);
          console.log("Cloudinary Upload Result: ")
          console.log(result);
          if(notnullorblank(happyHome.image) && notnullorblank(happyHome.cloudinaryId) ) {
              await cloudinary.uploader.destroy(happyHome.cloudinaryId); // you don't need to remove image src and id from database since we will be replacing them anyways. 
          }
          newHappyHomeupdate.image = result.secure_url;
          newHappyHomeupdate.cloudinaryId = result.public_id;

          // image: result.secure_url,
            // cloudinaryId: result.public_id
      }
      
      // do location here
      const newCoords = [
        // in MongoDB, type POINT has longitude first.
        req.body.longitude,
        req.body.latitude
      ]
      if(happyHome.location.coordinates !== newCoords) {
        newHappyHomeupdate.location = {
          type: 'Point',
          coordinates: newCoords
        }
      }

      // do options here
      let newOptions = {}
      HappyHomeOptions.forEach(option => {
        if(option in req.body) {
          newOptions[option] = '';
        }
      })

      if(newOptions !== {}) {
        newHappyHomeupdate.options = newOptions;
      }

      // console.log(happyHome);
      // do all others here
      const allOthers = ['name', 'address']
      for(key of allOthers) {
          console.log("Key: %s, Value: %s", key, happyHome[key]);
          if(happyHome[key] !== req.body[key]) {
            newHappyHomeupdate[key] = req.body[key]
          }
      }
      console.log("Values to update: ")
      console.log(newHappyHomeupdate)
      await HappyHome.findOneAndUpdate({_id: fetchID}, 
        newHappyHomeupdate)
        
        
        /*.catch(async (err) => {
            await cloudinary.destroy(result.public_id)
        })*/

      res.redirect(`/happyHome/${req.params.id}`)
    }
    catch (err) {
      console.log(err);
      await cloudinary.destroy(result.public_id) // destroy cloudinary image if url is not saved to database properly. 
      res.redirect(`/happyHome/${fetchID}`)
    }
  } 
}
function notnullorblank(item) {
  if(item === "" || item === null) return false;
  return true 
}