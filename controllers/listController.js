const mongoose = require('mongoose')
const List = mongoose.model('List')

exports.homePage = (req, res) => {
  res.render('index', { title: 'Fwd' })
}

exports.createList = (req, res) => {
  res.render('editList', {title: 'Create List'})
}

exports.saveList = async (req, res) => {
  const list = new List(req.body)
  await list.save()
  res.redirect('/')
}