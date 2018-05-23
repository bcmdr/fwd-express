const mongoose = require('mongoose')
const List = mongoose.model('List')
const Link = mongoose.model('Link')

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
  const links = await Link.find({list: list._id})
  if (!list) {
    return next()
  }
  res.render('list-page', {list, links, title: list.title})
}

exports.addLink = async (req, res, next) => {
  const list = await List.findOne({ slug: req.params.slug })
  if (!list) {
    return next()
  }
  res.render('editLink', { list, title: `${list.title}`, description: 'Add Link' })
}

exports.saveLink = async (req, res) => {
  const link = await (new Link(req.body)).save()
  req.flash('success', `Successfully added ${link.title}`)
  res.redirect(`/${req.params.slug}`)
}