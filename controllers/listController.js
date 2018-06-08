const mongoose = require('mongoose')
const helpers = require('../helpers')
const List = mongoose.model('List')
const Post = mongoose.model('Post')
const metascraper = require('metascraper')
const got = require('got')

const confirmOwner = (doc, user) => {
  return user && doc.owner.equals(user._id)
}

exports.homePage = async (req, res) => {
  const lists = req.user ? await List.find({ owner: req.user._id }) : {}
  res.render('index', { lists, title: `${helpers.siteDescription}` })
}

exports.addList = async (req, res, next) => {
  res.render('addList', { title: `Name Your List` })
}

exports.saveList = async (req, res) => {
  req.body.owner = req.user._id
  const list = await (new List(req.body)).save()
  // req.flash('success', `Successfully created ${list.title}`)
  res.redirect(`/lists/${list.slug}`)
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
  if (!req.body.targetUrl) return next();

  // if target url resembles a query instead, get url of top search engine result
  if ( req.body.targetUrl.includes('.') ) {
    return next()
  }

  // Microsoft Web Search API
  const subscriptionKey = process.env.SEARCH_KEY
  const host = 'api.cognitive.microsoft.com'
  const path = '/bing/v7.0/search'
  const searchUrl = host + path + '?q=' + encodeURIComponent(req.body.targetUrl)
  const { body } = await got(searchUrl, {
    headers : {
      'Ocp-Apim-Subscription-Key' : subscriptionKey,
    }
  })

  // No results found
  if (!body) return next()

  // Parse results
  const results = JSON.parse(body)
  const topResult = results.webPages.value[0]
  const { name: title, url } = topResult
  req.body.targetUrl = url
  req.body.meta = { title, url }
  next()
}

exports.getMetaData = async (req, res, next) => {

  // skip metascraper for now
  return next()

  if (!req.body.targetUrl) return next();

  // scrape and update metadata of target url
  const { body: html, url } = await got(req.body.targetUrl, { timeout: 5000 })
  req.body.meta = await metascraper({ html, url })
  next()
}

exports.saveLinkToList = async (req, res, next) => {
  // Get containing list from earlier middleware
  const list = req.list
  if (!list) { 
    return next() 
  }
  req.body.list = list._id

  // Create the post
  req.body.owner = req.user._id
  const post = await (new Post(req.body)).save()

  // Add post to the target list
  list.posts.push(post._id)
  await list.save()

  // Redirect On Success
  res.redirect(`/lists/${req.params.slug}`)
}

exports.getList = async(req, res, next) => {
  req.list = await List.findOne({ slug: req.params.slug })
  next()
}

exports.confirmListOwner = async (req, res, next) => {
  if (!confirmOwner(req.list, req.user)) {
    req.flash('error', `Sorry, you don't have permission to do that.`)
    return res.redirect('back')
  }
  next()
}

// exports.getListAndConfirmOwner = async (req, res, next) => {
//   // Find the containing list in the db
//   const list = await List.findOne({ slug: req.params.slug })
//   if (!confirmOwner(list, req.user)) {
//     req.flash('error', `Sorry, you don't have permission to do that.`)
//     return res.redirect('back')
//   }
//   req.list = list
//   next()
// }

exports.removeLinkFromList = async (req, res, next) => {

  const list = req.list

  // // Find the containing list in the db
  // const list = await List.findOne({ slug: req.params.slug })
  // if (!confirmOwner(list, req.user)) {
  //   req.flash('error', `Sorry, you don't have permission to do that.`)
  //   return res.redirect('back')
  // }

  // Remove the post reference from list
  list.set( { $pull: { posts: req.params.postId } } )
  const removeFromList = list.save()

  // const removeFromList = List.findOneAndUpdate(
  //   { slug: req.params.slug },
  //   { $pull: { posts: req.params.postId } }
  // ).exec()

  // Remove the post document from db
  const removePost = Post.findOneAndRemove(
    { _id: req.params.postId }
  ).exec()

  await Promise.all([removeFromList, removePost])

  res.redirect(`/lists/${req.params.slug}`)
}
