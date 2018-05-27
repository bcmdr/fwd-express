// const linksSource = require('../links')
// const cheerio = require('cheerio')
// const request = require('request-promise-native')

const mongoose = require('mongoose')
const Link = mongoose.model('Link')

// exports.shortcutForward = (req, res) => {
//   const shortcutId = req.params.shortcutId
//   const shortcut = getShortcutById(shortcutId)
//   res.redirect(shortcut.url)
// }

exports.addLink = (req, res) => {
  res.render('editLink', { title: 'Add Link' })
}

exports.saveLink = async (req, res) => {
  const link = await (new Link(req.body)).save()
  req.flash('success', `Successfully added ${link._id}`)
  res.redirect(`/links/${link._id}`)
}

exports.getLinkById = async (req, res, next) => {
  const link = await Link.findOne({ _id: req.params.id })
  if (!link) { return next() }
  res.render('showLink', {link, title: link.title})
}

