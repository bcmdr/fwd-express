const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')
const { slugify } = require('./_helpers')

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
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }]
})

listSchema.pre('save', (next) => slugify(next))

module.exports = mongoose.model('List', listSchema)