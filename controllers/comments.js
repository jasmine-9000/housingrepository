const Post = require('../models/HappyHome');
const Comment = require('../models/Comment');
const { node } = require('webpack');

module.exports = {
  createComment: async (req, res) => {
    try {
      // Upload image to cloudinary

      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        happyhome: req.params.id,
        user: req.user.id
      });
      console.log('Comment has been added!');
      res.redirect(`/happyHome/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  likeComment: async (req, res) => {
    try {
      await Comment.findOneAndUpdate(
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
  editComment: async (req, res) => {
    const fetchID = req.params.id;
    if(process.env.NODE_ENV === 'development') {
      console.log("Attempting to edit comment %s...", fetchID)
    }
    try {
      const newtext = req.body.newtext; 
      console.log(req.body);
      console.log(req.body.newtext);
      await Comment.findOneAndUpdate(
        // find post to update by ID,
        { _id: req.params.id },
        {
          $set: {
            comment: newtext,
            modifiedAt: Date.now()
          }
        }
      );
      res.json({status: 'SUCCESS', status_code: 200, message: 'Successfully edited comment in database.'});
    } catch(err) {
      console.log('Could not edit comment.');
      console.log(err)
      res.json({status: 'FAILURE', status_code: err.code, message: err})
    }
  },
  deleteComment: async (req, res) => {
    try {
      // Find post by id

      let comment = await Comment.findById({ _id: req.params.id });
      // Delete post from db
      await Comment.remove({ _id: req.params.id });
      console.log('Deleted Comment');
      console.log(req.params.id);
      res.redirect(`/happyHome/${req.query.happyhomeid}`);
    } catch (err) {
      res.redirect(err);
    }
  },
};
