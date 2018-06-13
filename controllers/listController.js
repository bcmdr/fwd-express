const mongoose = require('mongoose')
const helpers = require('../helpers')
const List = mongoose.model('List')
const Post = mongoose.model('Post')
const User = mongoose.model('User')
const metascraper = require('metascraper')
const got = require('got')

exports.homePage = async (req, res) => {
  const lists = req.user ? await List.find({ owner: req.user._id }) : {}
  res.render('index', { lists, title: `${helpers.siteDescription}` })
}

exports.getUserLists = async (req, res) => {
  const user = await User.findOne({ username: req.params.user })
  if (!user) {
    return next() // user not found
  }
  const lists = await List.find({ owner: user._id })
  res.render('userLists', { lists, owner: user, title: `${user.username}'s Lists` })
}

exports.newList = async (req, res, next) => {
  res.render('newList', { title: `New List` })
}

const getSearchSource = (title) => {
  if (title.match(/board ?game/gi)) 
    return 'boardgamegeek'
  if (title.match(/video ?game/gi))
    return 'gamespot'
  if (title.match(/movie/gi))
    return 'imdb'
  if (title.match(/tv +/) || title.match(/televison/))
    return 'imdb'
}

exports.determineSearchSource = (req, res, next) => {
  req.body.searchSource = getSearchSource(req.body.title)
  next()
}

exports.saveList = async (req, res) => {
  req.body.owner = req.user._id
  const list = await (new List(req.body)).save()
  res.redirect(`/${req.user.username}/${list.slug}`)
}

exports.getUserListBySlug = async (req, res, next) => {
  // Find the list and fetch nested posts and their nested links
  const user = await User.findOne({ username: req.params.user })
  const list = await List.findOne({ owner: user._id, slug: req.params.slug })
    .populate('posts')
  if (!list) { return next() }
  res.render('showList', {list, owner: user, title: list.title})
}

exports.getList = async (req, res, next) => {
  req.owner = await User.findOne({ username: req.params.user })
  req.list = await List.findOne({ owner: req.owner._id, slug: req.params.slug })
  next()
}

const confirmOwner = (doc, user) => {
  return user && doc.owner.equals(user._id)
}

exports.confirmListOwner = async (req, res, next) => {
  if (!confirmOwner(req.list, req.user)) {
    req.flash('error', `Sorry, you don't have permission to do that.`)
    return res.redirect('back')
  }
  next()
}

exports.addLinkToList = async (req, res) => {
  res.render('addLink', {list: req.list, owner: req.owner, title: `Add to ${req.list.title}`})
}

exports.searchPostDetails = async (req, res, next) => {
  if (!req.body.originalSearch) return next();

  let searchTerm = `${req.body.originalSearch} ${req.list.searchSource || ''}`

  // Microsoft Web Search API
  const subscriptionKey = process.env.SEARCH_KEY
  const host = 'api.cognitive.microsoft.com'
  const path = '/bing/v7.0/search'
  const searchUrl = host + path + '?q=' + encodeURIComponent(searchTerm)
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
  req.body.searchMeta = topResult
  req.body.targetUrl = topResult.url
  next()
}

exports.getMetaData = async (req, res, next) => {
  if (!req.body.targetUrl) return next();
  // scrape and update metadata of target url
  const { body: html, url } = await got(req.body.targetUrl, { timeout: 5000 })
  req.body.siteMeta = await metascraper({ html, url })
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
  res.redirect(`/${req.owner.username}/${req.params.slug}`)
}

exports.removeLinkFromList = async (req, res) => {

  const list = req.list

  // Remove the post reference from list
  list.set( { $pull: { posts: req.params.postId } } )
  const removeFromList = list.save()

  // Remove the post document from db
  const removePost = Post.findOneAndRemove(
    { _id: req.params.postId }
  ).exec()

  await Promise.all([removeFromList, removePost])

  res.redirect(`/${req.owner.username}/${req.params.slug}`)
}

exports.removeList = async (req, res) => {
  const list = req.list
  const removeList = List.findOneAndRemove({
    _id: list._id
  }).exec()
  const removePosts = Post.deleteMany({
    list: list._id
  }).exec()
  await Promise.all([removeList, removePosts])
  req.flash('success', `Removed List: ${list.title}`)
  res.redirect('/')
}

exports.listSettings = async (req, res) => {
  res.render('listSettings', {list: req.list, owner: req.owner, title: `Settings for ${req.list.title}`})
}

exports.saveListSettings = async (req, res) => {
    

  const list = await List.findById(req.list._id)

  list.title = req.body.title
  list.searchSource = req.body.searchSource

  const savedList = await list.save( 
    {validateBeforeSave: true}
  )
  
  req.flash('success', 'List settings saved.')
  res.redirect(`/${req.owner.username}/${savedList.slug}`)
}
