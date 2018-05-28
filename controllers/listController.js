const mongoose = require('mongoose')
const helpers = require('../helpers')
const Collection = mongoose.model('Collection')
const List = mongoose.model('List')
const Item = mongoose.model('Item')
const Link = mongoose.model('Link')
const Post = mongoose.model('Post')

const metascraper = require('metascraper')
const got = require('got')

exports.homePage = (req, res) => {
  res.render('index', { title: `${helpers.siteDescription}` })
}

exports.addList = async (req, res, next) => {
  res.render('addList', { title: `Name Your List` })
}

exports.saveList = async (req, res) => {
  const list = await (new List(req.body)).save()
  // req.flash('success', `Successfully created ${list.title}`)
  res.redirect(`/lists/${list.slug}`)
}

exports.getLists = async (req, res) => {
  const lists = await List.find()
  res.render('lists', { title: 'Lists', lists })
}

exports.getListBySlug = async (req, res, next) => {
  // Find the list and fetch nested posts and their nested links
  const list = await List.findOne({ slug: req.params.slug })
    .populate({ path: 'posts', populate: { path: 'link', model: 'Link'} })
  if (!list) { return next() }
  res.render('showList', {list, title: list.title})
}

exports.addLinkToList = async (req, res, next) => {
  const list = await List.findOne({ slug: req.params.slug })
  if (!list) return next()
  res.render('addLink', {list, title: `Add Link to ${list.title}`})
}

exports.saveLinkToList = async (req, res, next) => {
  // Find the Containing List
  const list = await List.findOne({ slug: req.params.slug })
  if (!list) { return next() }

  // Prepare Link for Saving
  // const linkId = new mongoose.Types.ObjectId()
  // req.body._id = linkId
  // Set containing list
  req.body.lists = [list._id]

  const targetUrl = req.body.url
  const {body: html, url} = await got(targetUrl)
  const metadata = await metascraper({html, url})
  req.body.meta = metadata

  // Save the Link
  const savedLink = await (new Link(req.body)).save()

  // Create the Post
  const post = {
    link: savedLink._id,
    list: list._id
  }
  const savedPost = await (new Post(post)).save()

  // Update containing list
  list.posts.push(savedPost._id)
  await list.save()

  // Redirect On Success
  res.redirect(`/lists/${req.params.slug}`)
}

// exports.getCollections = async (req, res) => {
//   const collections = await Collection.find()
//   res.render('collections', { title: 'Collections', collections })
// }

// exports.getCollectionBySlug = async (req, res, next) => {
//   const collection = await Collection.findOne({ slug: req.params.slug })
//   let lists = await List.find({ collectionId: collection._id })
//   lists = await Promise.all(lists.map( async (list) => {
//     // https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
//     list.items = await Item.find({ listId: list._id })
//     return list
//   }))
//   if (!collection) return next()
//   res.render('collectionPage', { collection, lists, title: collection.title })
// }

// exports.saveCollection = async (req, res) => {
//   const collection = await (new Collection(req.body)).save()
//   req.flash('success', `Successfully created ${collection.title}`)
//   res.redirect(`/collections/${collection.slug}`)
// }

// exports.addCollection = (req, res) => {
//   res.render('editCollection', { title: 'New Collection' })
// }