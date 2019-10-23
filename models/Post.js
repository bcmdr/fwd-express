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
  createdOn: {
    type: Date,
    default: Date.now
  },
  targetUrl: {
    type: String, 
    trim: true, 
    required: 'Please enter a valid website link.'
  },
  siteMeta: {
    type: Schema.Types.Mixed,
    required: 'Please provide site meta data.'
  },
  list: { 
    type: Schema.Types.ObjectId, 
    ref: 'List',
    required: 'Please provide a containing list.'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: 'Please provide the owner.'
  }
})

module.exports = mongoose.model('Post', postSchema)