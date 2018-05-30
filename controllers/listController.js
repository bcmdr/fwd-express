const mongoose = require('mongoose')
const helpers = require('../helpers')
const Collection = mongoose.model('Collection')
const List = mongoose.model('List')
const Item = mongoose.model('Item')
const Link = mongoose.model('Link')
const Post = mongoose.model('Post')

const metascraper = require('metascraper')
const got = require('got')

exports.homePage = async (req, res) => {
  const lists = await List.find()
  res.render('index', { lists, title: `${helpers.siteDescription}` })
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
    .populate('posts')
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

  // Create the post from target url
  const post = await (new Post({ targetUrl: req.body.url, list: list._id })).save()

  // Add post to the target list
  list.posts.push(post._id)
  await list.save()

  // Redirect On Success
  res.redirect(`/lists/${req.params.slug}`)
}

// exports.editPost = async (req, res, next) => {
//   const post = await Post.findOne({ shortId: req.params.shortId })
//     .populate({ path: 'list', model: 'List'})
//   if (!post) return next()
//   res.render('editPost', {post, title: `Edit Post on ${post.list.title}`})
// }
