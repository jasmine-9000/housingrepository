const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  happyhome: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HappyHome',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  }
});

CommentSchema.pre('save', function(next, doc) {
  console.log("From CommentSchema pre:")
  console.log(doc);
  next();
})
module.exports = mongoose.model('Comment', CommentSchema);
