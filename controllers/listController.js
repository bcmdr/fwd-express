const mongoose = require('mongoose')
const Collection = mongoose.model('Collection')
const List = mongoose.model('List')
const Item = mongoose.model('Item')
const Link = mongoose.model('Link')


exports.homePage = (req, res) => {
  res.render('index', { title: 'Share Organized Links' })
}

exports.addList = async (req, res, next) => {
  const collection = await Collection.findOne({ slug: req.query.collection })
  res.render('editList', { collection, title: `New List` })
}

exports.addCollection = (req, res) => {
  res.render('editCollection', { title: 'New Collection' })
}

exports.saveList = async (req, res) => {
  const collection = await Collection.findOne({ slug: req.body.collection })
  req.body.collectionId = collection._id

  const list = await (new List(req.body)).save()
  req.flash('success', `Successfully created ${list.title}`)
  res.redirect(`/collections/${collection}/${list.slug}`)
}

exports.saveCollection = async (req, res) => {
  const collection = await (new Collection(req.body)).save()
  req.flash('success', `Successfully created ${collection.title}`)
  res.redirect(`/collections/${collection.slug}`)
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
  res.render('listPage', {list, links, title: list.title})
}

exports.getCollectionBySlug = async (req, res, next) => {
  const collection = await Collection.findOne({ slug: req.params.slug })
  const lists = await List.find({ collectionId: collection._id })
  if (!collection) return next()
  res.render('collectionPage', { collection, lists, title: collection.title })
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