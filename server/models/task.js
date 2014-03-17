var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  userId: {
    type: Schema.ObjectId
  },
  task: {
    type: String,
    required: 'Task required'
  },
  description: {
    type: String
  },
  priority: {
    type: String,
    enum: ['now', 'high', 'medium', 'low']
  },
  status: {
    type: Boolean
  }
}, { versionKey: false });

module.exports = mongoose.model('Task', schema);