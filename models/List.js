const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const listSchema = new mongoose.Schema({
  title: {
    type: String, 
    trim: true, 
    required: 'Please enter a list title.'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  }
})

listSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    // title not modified
    return next()
  }
  this.slug = slug(this.title)
  next();
  // TODO: make slugs unique
})

module.exports = mongoose.model('List', listSchema)