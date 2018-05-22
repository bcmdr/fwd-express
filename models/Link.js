const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const linkSchema = new mongoose.Schema({
  title: {
    type: String, 
    trim: true, 
  },
  url: {
    type: String,
    trim: true,
    required: 'Please enter a url title.'
  }, 
  list: String
})

module.exports = mongoose.model('Link', linkSchema);