var path = require('path')

var writer = '/Users/lepture/workspace/node/nico/lib/writer.'

exports.theme = __dirname
exports.package = require(path.join(process.cwd(), 'package.json'))
exports.source = process.cwd()
exports.output = path.join(process.cwd(), '_site')
exports.permalink = '{{directory}}/{{filename}}.html'
exports.ignore = ['_site']
exports.writers = [
  writer + 'PageWriter',
  writer + 'StaticWriter',
  writer + 'FileWriter',
]
