var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

module.exports = mongoose.model('RefreshToken', schema);