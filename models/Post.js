const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const shortid = require('shortid');

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
  link: { type: Schema.Types.ObjectId, ref: 'Link' }, 
  list: { type: Schema.Types.ObjectId, ref: 'List' }
})

module.exports = mongoose.model('Post', postSchema)