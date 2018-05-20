const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const slug = require('slugs')

const linkSchema = new mongoose.Schema({
  title: {
    type: String, 
    trim: true, 
    required: 'Please enter a url title.'
  },
  url: {
    type: String,
    trim: true
  }
})

module.exports = mongoose.model('Link', linkSchema);