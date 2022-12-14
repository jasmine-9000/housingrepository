const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  /*
  latitude: {
    type: mongoose.Schema.Types.Decimal128,
  },
  longitude: {
    type: mongoose.Schema.Types.Decimal128
  }, */
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date, 
    default: Date.now
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  options: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('HappyHome', HomeSchema);
