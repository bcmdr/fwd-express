const mongoose = require('mongoose')
const List = mongoose.model('List')

exports.homePage = (req, res) => {
  res.render('index', { title: 'Fwd' })
}

exports.createList = (req, res) => {
  res.render('editList', {title: 'Create List'})
}

exports.saveList = async (req, res) => {
  const list = await (new List(req.body)).save()
  req.flash('success', `Successfully created ${list.title}`)
  res.redirect(`/list/${list.slug}`)
}

exports.getLists = async (req, res) => {
  const lists = await List.find()
  res.render('lists', {title: 'All Lists', lists})
}