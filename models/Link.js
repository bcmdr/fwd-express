const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const shortid = require('shortid');

const linkSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  title: {
    type: String, 
    trim: true, 
  },
  description: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true,
    required: 'Please enter a URL.'
  }, 
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
})

module.exports = mongoose.model('Link', linkSchema);