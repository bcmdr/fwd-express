const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const itemSchema = new mongoose.Schema({
  content: {
    type: String, 
    trim: true, 
  }, 
  listId: String
})

module.exports = mongoose.model('Item', itemSchema);