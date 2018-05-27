const mongoose = require('mongoose')
const h = require('../helpers')
const Collection = mongoose.model('Collection')
const List = mongoose.model('List')
const Item = mongoose.model('Item')
const Link = mongoose.model('Link')


exports.homePage = (req, res) => {
  res.render('index', { title: `${h.siteDescription}` })
}

exports.addList = async (req, res, next) => {
  const collectionSlug = req.query.collection
  const collection = collectionSlug ? await Collection.findOne({ slug: req.query.collection }) : {}
  res.render('editList', { collection, title: `Name Your List` })
}

exports.saveList = async (req, res) => {
  const list = await (new List(req.body)).save()
  // req.flash('success', `Successfully created ${list.title}`)
  res.redirect(`/lists/${list.slug}`)
}

exports.addCollection = (req, res) => {
  res.render('editCollection', { title: 'New Collection' })
}

exports.saveCollection = async (req, res) => {
  const collection = await (new Collection(req.body)).save()
  req.flash('success', `Successfully created ${collection.title}`)
  res.redirect(`/collections/${collection.slug}`)
}

exports.getLists = async (req, res) => {
  const lists = await List.find()
  res.render('lists', { title: 'Lists', lists })
}

exports.getCollections = async (req, res) => {
  const collections = await Collection.find()
  res.render('collections', { title: 'Collections', collections })
}

exports.getListBySlug = async (req, res, next) => {
  const list = await List.findOne({ slug: req.params.slug })
  if (!list) { return next() }
  list.items = await Item.find({listId: list._id})
  res.render('showList', {list, title: list.title})
}

exports.getCollectionBySlug = async (req, res, next) => {
  const collection = await Collection.findOne({ slug: req.params.slug })
  let lists = await List.find({ collectionId: collection._id })
  lists = await Promise.all(lists.map( async (list) => {
    // https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
    list.items = await Item.find({ listId: list._id })
    return list
  }))
  if (!collection) return next()
  res.render('collectionPage', { collection, lists, title: collection.title })
}

// exports.addLink = async (req, res, next) => {
//   const link = await List.findOne({ slug: req.params.slug })
//   if (!link) {
//     return next()
//   }
//   res.render('editLink', { link, title: `${link.title}`, description: 'Add Link' })
// }

exports.addLinkToList = async (req, res, next) => {
  const list = await List.findOne({ slug: req.params.slug })
  if (!list) return next()
  res.render('addLink', {list, title: `Add Link to ${list.title}`})
}

exports.saveLink = async (req, res) => {
  const link = await (new Link(req.body)).save()
  req.flash('success', `Successfully added ${link.title}`)
  res.redirect(`/${req.params.slug}`)
}

exports.saveLinkToList = async (req, res, next) => {
  // Find the List
  const list = await List.findOne({ slug: req.params.slug })
  if (!list) { return next() }
  // Prepare Link for Saving
  const linkId = new mongoose.Types.ObjectId()
  req.body._id = linkId
  // Save first list containing this link
  req.body.lists = [list._id]
  // Update links contained in this list
  list.links.push(linkId)
  list.save()
  // Save the Link
  const link = await (new Link(req.body)).save()
  // Redirect On Success
  req.flash('success', `Successfully added ${link.url}`)
  res.redirect(`/lists/${req.params.slug}`)
}

exports.saveItem = async (req, res) => {
  const item = await (new Item(req.body)).save()
  //req.flash('success', `Successfully added ${item.content}`)
  const redirectUrl = req.originalUrl.split('/').slice(0, -1).join('/')
  res.redirect(redirectUrl)
}