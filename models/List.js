const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const slug = require('slugs')
const shortid = require('shortid');

const listSchema = new Schema({
  _id: Schema.Types.ObjectId,
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
  links: [{ type: Schema.Types.ObjectId, ref: 'Link' }]
})

listSchema.pre('save', async function(next) {
  if (!this.isModified('title')) {
    // title not modified
    return next()
  }
  this.slug = slug(this.title)

  // find other lists that have the same slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const mathchesWithSlug = await this.constructor.find({ slug: slugRegEx });

  // If a slug already exists, add an incremented number to the end
  if (mathchesWithSlug.length) {
    this.slug =`${this.slug}-${mathchesWithSlug.length + 1}`
  }

  next();
})

module.exports = mongoose.model('List', listSchema)