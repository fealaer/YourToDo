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
    enum: ['none', 'now', 'high', 'medium', 'low']
  },
  status: {
    type: String,
    enum: ['none', 'in progress', 'done']
  }
}, { versionKey: false });

module.exports = mongoose.model('Task', schema);