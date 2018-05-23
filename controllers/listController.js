const mongoose = require('mongoose')
const h = require('../helpers')
const Collection = mongoose.model('Collection')
const List = mongoose.model('List')
const Item = mongoose.model('Item')
const Link = mongoose.model('Link')


exports.homePage = (req, res) => {
  res.render('index', { title: `${h.siteName} — ${h.siteDescription}` })
}

exports.addList = async (req, res, next) => {
  const collectionSlug = req.query.collection
  const collection = collectionSlug ? await Collection.findOne({ slug: req.query.collection }) : {}
  res.render('editList', { collection, title: `New List` })
}

exports.saveList = async (req, res) => {

  // TODO: refactor for readability

  let collection

  // Collection has been provided
  if (req.body.collection) {
    // Get or create the collection
    collection = await Collection.findOne({ slug: req.body.collection })
    if (!collection) {
      collection = await (new Collection({
        // TODO: collection id passing needs to be more resilient, this is a quick fix.
        title: req.body.collection
      })).save()
    }
    // Pass the collection id to the list
    req.body.collectionId = collection._id
  }
  
  // Save the list
  const list = await (new List(req.body)).save()

  // Redirect upon success
  req.flash('success', `Successfully created ${list.title}`)
  if (collection)
    res.redirect(`/collections/${collection.slug}/${list.slug}`)
  else {
    res.redirect(`/lists/${list.slug}`)
  }
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
  let lists = await List.find({ collectionId: collection._id })
  lists = await Promise.all(lists.map( async (list) => {
    // https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
    list.items = await Item.find({ listId: list._id })
    return list
  }))
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

exports.saveItem = async (req, res) => {
  const item = await (new Item(req.body)).save()
  console.log(item)
  const list = await List.findOne({_id: item.listId})
  const collection = await Collection.findOne({_id: list.collectionId})
  //req.flash('success', `Successfully added ${item.content}`)
  res.redirect(`/collections/${collection.slug}/${list.slug}`)
}