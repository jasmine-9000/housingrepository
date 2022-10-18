// imports
const cloudinary = require('../middleware/cloudinary');
const HappyHome = require('../models/HappyHome');
const Comment = require('../models/Comment');

// create MongoDB indices
HappyHome.createIndexes({location: "2dsphere"})

// list all options for homes here.
// example: autism friendly, takes housing vouchers.
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
  // render user profile. 
  // include new home form inside. 
  getProfile: async (req, res) => {
    try {
      // passport js ensures req.user is never null, otherwise it will redirect to index. 
      // find all homes submitted by current user .
      const happyHomes = await HappyHome.find({ user: req.user.id });
      if(process.env.NODE_ENV === 'development') {
        console.log(happyHomes)
      }
      // render user profile with new home form. 
      res.render('profile.ejs', { happyHomes: happyHomes, user: req.user});
    } catch (err) {
      // log errors to console in both production and development. 
      console.log(err);
      
      if(err === 404) {
        res.render('errors/404.ejs');

      } else {
        res.render('errors/503.ejs')
      }
    }
  },
  // render single home.
  getHappyHome: async (req, res) => {
    try {

      // passport js ensures req.user is never null, otherwise it will redirect to index. 
      // find the home and comments made about the home.
      const happyhome = await HappyHome.findById(req.params.id);
      const comments = await Comment.find({ happyhome: req.params.id })
        .populate('user', 'userName')
        .sort({ createdAt: 'desc' })
        .lean();

      // only in development, log out comments. 
      if(process.env.NODE_ENV === 'development') {
        console.log(comments);
      }
      // render the home. 
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
  // same as getHappyHome, only user is null. 
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
  // add new home to database.
  createHappyHome: async (req, res) => {
    try {
      // passport js ensures req.user is never null, otherwise it will redirect to index. 


      // parse coordinates from request body
      // if no coorinates, throw error!
      let long = req.body.longitude,
          lat = req.body.latitude
      let hasErrors = false;
      if(!notnullorblank(long) ){
        console.log("")
        req.flash("errors", {"msg": "Must have latitude (or use google maps input form)"})
        hasErrors = true
      }
      if(!notnullorblank(lat) ){
        req.flash("errors", {"msg": "Must have longitude (or use google maps input form)"})
        hasErrors = true
      }
      if(!notnullorblank(req.body.address)) {
        req.flash("errors", {"msg": "Must have display address (or use google maps input form to autofill)."})
        hasErrors = true
      }
      if(!notnullorblank(req.body.name)) {
        req.flash("errors", {"msg": "Must have display name."});
        hasErrors = true
      }
      if(hasErrors) {
        throw {"code": 402}
      }
      const coords = [
        // in MongoDB, type POINT has longitude first.
        long,
        lat
      ]
      if(process.env.NODE_ENV === 'developement') {
        console.log('Latitude and Longitude: [%s, %s]', coords[1], coords[0]);
        console.log('MongoDB storage: [%s, %s]', coords[0], coords[1]);
      }
      
      let newHappyHome;
      if(req.file) {
        
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        if(process.env.NODE_ENV === 'development') {
          console.log("Image uploaded.");
          console.log("Cloudinary ID: %s", result.public_id);
          console.log("Cloudinary URL: %s", result.secure_url);
        }
        // create new home
        newHappyHome = await HappyHome.create({
          name: req.body.name,
          image: result.secure_url,
          cloudinaryId: result.public_id,
          address: req.body.address,
          description: req.body.description,
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
      } else {
          if(process.env.NODE_ENV === 'development') {
            console.log("No image provided...");
          }
          // create new home
          newHappyHome = await HappyHome.create({
            name: req.body.name,
            image: "",
            cloudinaryId: "",
            address: req.body.address,
            description: req.body.description,
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
      console.log('Home has been added! Home ID: %s', newHappyHome.id);
      res.redirect('/profile');
    } catch (err) {
      console.log("Error creating new home. ")
      console.log(err);
      req.flash("errors", {msg: "Error handling form"})
      res.redirect('/profile')
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
      if(process.env.NODE_ENV === 'development') {
        console.log(`Likes +1 to Home ${req.params.id}`);
      }
      res.redirect(`/happyHome/${req.params.id}`); // Redirect back to post page
    } catch (err) {
      console.log(err);
      req.flash("errors", {msg: 'Could not like home'})
      res.redirect(`/happyHome/${req.params.id}`)
    }
  },
  deleteHappyHome: async (req, res) => {
    const fetchID = req.params.id
    // development logging
    if(process.env.NODE_ENV === 'development') {
      console.log("Attempting to delete Home %s", fetchID);
    }
    try {
      
      // Find post by id
      let happyHome = await HappyHome.findById({ _id: fetchID });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(happyHome.cloudinaryId);
      // Delete post from db
      await HappyHome.remove({ _id: fetchID });
      console.log('Deleted Home %s', fetchID);
      res.redirect('/profile');
    } catch (err) {
      req.flash("errors", {msg: "Could not delete home."})
      res.redirect('/profile');
    }
  },
  // delete only image from database and cloudinary.
  deleteHappyHomeImage: async (req, res) => {
    const fetchID = req.params.id;
    if(process.env.NODE_ENV === 'development') {
      console.log("Attempting to delete Home %s...", fetchID)
    }
    try {
      // delete image in cloudinary
      let happyHome = await HappyHome.findById({_id: fetchID});
      await cloudinary.uploader.destroy(happyHome.cloudinaryId);

      // update home in database to have image and cloudinaryid to be blank
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
      console.log("Image deleted from Home %s", fetchID)
      res.redirect(`/happyHome/${fetchID}`)
    } catch(err) {
      console.log("Error occurred deleting only happy home image. Details: ");
      console.log(err);
      req.flash("errors", {msg: "Could not delete image."})
      res.redirect(`/happyHome/${fetchID}`)
    }
  },

  // load edit happy home page
  editHappyHome: async (req, res) => {
    const fetchID = req.params.id

    if(process.env.NODE_ENV === 'development') {
      console.log('Attempting to load edit page for home %s...', fetchID);
    }
    try {
      // fetch home details from mongodb
      let happyhome = await HappyHome.findById({ _id: fetchID });
      // render it to user
      res.render("edithappyhome", {happyhome: happyhome})

    } catch(err) {
      console.log(err);
      req.flash('errors', {msg: 'Could not load edit page'})
      res.redirect('/happyHome/' + req.params.id)
    }
  },

  // actually edit home using user-provided details
  editHappyHomeWrite: async (req, res) => {
    const fetchID = req.params.id;
    if(process.env.NODE_ENV === 'development') {
      console.log("Attempting to modify home %s...", fetchID)
      console.log("File path: %s", req.file);
    }
    
    // cloudinary upload results stored here. 
    // lets us have a choice if we're going to update image or not.
    let result;
    try {
      // find home in mongodb. 
      const happyHome = await HappyHome.findById({_id: fetchID})
      if(process.env.NODE_ENV === 'development') {
        console.log("Old home details: ")
        console.log(happyHome)
      }

      // list things to update in mongodb 
      let newHappyHomeupdate = {}
      
      // do new image here
      if(req.file) {
          // upload new cloudinary update .
          result = await cloudinary.uploader.upload(req.file.path);
          if(process.env.NODE_ENV === 'development') {
            console.log("Cloudinary Upload Result: ")
            console.log(result);
          }
          // if there was a an old image, destroy it.
          if(notnullorblank(happyHome.image) && notnullorblank(happyHome.cloudinaryId) ) {
              await cloudinary.uploader.destroy(happyHome.cloudinaryId); 
              // you don't need to remove image src and id from database since we will be replacing them anyways. 
          }
          // add them to the list of things to update in mongodb. 
          newHappyHomeupdate.image = result.secure_url;
          newHappyHomeupdate.cloudinaryId = result.public_id;
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
      const allOthers = ['name', 'address', 'description']
      for(key of allOthers) {
          console.log("Key: %s, Value: %s", key, happyHome[key]);
          console.log("Key: %s, Value: %s", key, req.body[key]);
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
      // await cloudinary.destroy(result.public_id) // (doesn't work) destroy cloudinary image if url is not saved to database properly. 
      res.redirect(`/happyHome/${fetchID}`)
    }
  } 
}

// utiltity functions
function notnullorblank(item) {
  if(item === "" || item === null) return false;
  return true 
}