const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const shortid = require('shortid');

const linkSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  shortId: {
    type: String,
    'default': shortid.generate
  },
  meta: {
    type: Schema.Types.Mixed,
    required: 'Could not find meta data.'
  },
  url: {
    type: String,
    trim: true,
    required: 'Please enter a URL.'
  }, 
  lists: [{ type: Schema.Types.ObjectId, ref: 'List' }]
})

module.exports = mongoose.model('Link', linkSchema);