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

exports.searchNonUrls = async (req, res, next) => {
  // if target url resembles a query instead, get url of top search engine result

  if ( req.body.targetUrl.includes('.') ) {
    return next()
  }

  const subscriptionKey = 'fe91fd20d1ba4aaca8d7385196dc7968'
  const host = 'api.cognitive.microsoft.com'
  const path = '/bing/v7.0/search'
  const searchUrl = host + path + '?q=' + encodeURIComponent(req.body.targetUrl)

  const { body } = await got(searchUrl, {
    headers : {
      'Ocp-Apim-Subscription-Key' : subscriptionKey,
    }
  })

  if (!body) return next()

  const results = JSON.parse(body)
  req.body.targetUrl = results.webPages.value[0].url
  console.log(results)
  next()
}

exports.getMetaData = async (req, res, next) => {
  // scrape and update metadata of target url
  const { body: html, url } = await got(req.body.targetUrl)
  req.body.meta = await metascraper({ html, url })
  console.log(req.body.meta)
  next()
}

exports.saveLinkToList = async (req, res, next) => {
  // Find the Containing List
  const list = await List.findOne({ slug: req.params.slug })
  if (!list) { return next() }
  req.body.list = list._id

  // Create the post
  const post = await (new Post(req.body)).save()

  // Add post to the target list
  list.posts.push(post._id)
  await list.save()

  // Redirect On Success
  res.redirect(`/lists/${req.params.slug}`)
}

exports.removeLinkFromList = async (req, res, next) => {

  // Remove the post reference from list
  const removeFromList = List.findOneAndUpdate(
    { slug: req.params.slug },
    { $pull: { posts: req.params.postId } }
  ).exec()

  // Remove the post document from db
  const removePost = Post.findOneAndRemove(
    { _id: req.params.postId }
  ).exec()

  await Promise.all([removeFromList, removePost])

  res.redirect(`/lists/${req.params.slug}`)
}
