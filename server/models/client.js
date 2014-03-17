var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  clientId: {
    type: String,
    unique: true,
    required: true
  },
  clientSecret: {
    type: String,
    required: true
  }
}, { versionKey: false });

module.exports = mongoose.model('Client', schema);