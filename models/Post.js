const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const shortid = require('shortid');

const metascraper = require('metascraper')
const got = require('got')

// const linkSchema = new Schema({
//   targetUrl: {
//     type: String, 
//     trim: true, 
//     required: 'Please enter a list title.'
//   },
//   meta: {
//     type: Schema.Types.Mixed
//   }
// })

// linkSchema.pre('save', async function(next) {
//   // scrape and update metadata of target url
//   const { body: html, url } = await got(this.targetUrl)
//   this.meta = await metascraper({ html, url })

//   next();
// })

const postSchema = new Schema({
  shortId: {
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
  createdOn: {
    type: Date,
    default: Date.now
  },
  votes: {
    type: Number,
    default: 1
  },
  targetUrl: {
    type: String, 
    trim: true, 
    required: 'Please enter a url.'
  },
  meta: {
    type: Schema.Types.Mixed
  },
  list: { type: Schema.Types.ObjectId, ref: 'List' }
})

postSchema.pre('save', async function(next) {
  // scrape and update metadata of target url
  const { body: html, url } = await got(this.targetUrl)
  this.meta = await metascraper({ html, url })
  next();
})

module.exports = mongoose.model('Post', postSchema)