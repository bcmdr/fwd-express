const mongoose = require('mongoose')
const List = mongoose.model('List')

exports.homePage = (req, res) => {
  res.render('index', { title: 'Fwd' })
}

exports.createList = (req, res) => {
  res.render('editList', { title: 'Create a List of Links' })
}

exports.saveList = async (req, res) => {
  const list = await (new List(req.body)).save()
  req.flash('success', `Successfully created ${list.title}`)
  res.redirect(`/${list.slug}`)
}

exports.getLists = async (req, res) => {
  const lists = await List.find()
  res.render('lists', { title: 'All Lists', lists })
}

exports.getListBySlug = async (req, res, next) => {
  const list = await List.findOne({ slug: req.params.slug })
  if (!list) {
    // call the 'not found' handler in app.js
    return next()
  }
  res.render('list', {list, title: list.title})
}