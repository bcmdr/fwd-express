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
  },
  collectionId: String,
})

listSchema.pre('save', async function(next) {
  if (!this.isModified('title')) {
    // title not modified
    return next()
  }
  this.slug = slug(this.title)

  // find other lists that have the same slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const listsWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (listsWithSlug.length) {
    this.slug =`${this.slug}-${listsWithSlug.length + 1}`
  }

  next();
})

module.exports = mongoose.model('List', listSchema)