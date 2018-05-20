const linksSource = require('../links')
const cheerio = require('cheerio')
const request = require('request-promise-native')

exports.homePage = (req, res) => {
  res.render('index', { title: 'fwd' })
}

const getShortcutById = (shortcutId) => {
  const shortcut = linksSource.shortcuts[shortcutId]
  return shortcut
}

exports.shortcutForward = (req, res) => {
  const shortcutId = req.params.shortcutId
  const shortcut = getShortcutById(shortcutId)
  res.redirect(shortcut.url)
}

exports.listPage = async (req, res) => {
  const listId = req.params.listId
  const list = linksSource.lists[listId]
  const [title, links] = [list.title, list.links]

  const options = {
    uri: 'https://twitter.com/bcmdr',
    transform: function (body) {
        return cheerio.load(body);
    }
  };

  const $ = await request(options)

  console.log($('title').text())

  // let response = await request('https://twitter.com/bcmdr')

  // console.log(response)

  // const newLinks = links.map(item => {
  //   return await request(item.url, function (error, response, body) 
  //   {
  //     if (!error && response.statusCode == 200) 
  //     {
  //       var $ = cheerio.load(body);
  //       var title = $("title").text();
  //     }
  //   })
  // })

  res.render('list', { title, links })
}

