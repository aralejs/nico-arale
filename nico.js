var path = require('path');


// {{ settings for nico
exports.theme = __dirname
exports.source = process.cwd()
exports.output = path.join(process.cwd(), '_site')
exports.permalink = '{{directory}}/{{filename}}.html'
exports.google = 'UA-36247332-1'
exports.ignorefilter = function(filepath, subdir) {
  if (/^(_site|_theme|node_modules)/.test(subdir)) {
    return false;
  }
  return true;
}
exports.writers = [
  'nico.PageWriter',
  'nico.StaticWriter',
  'nico.FileWriter',
  require('./theme').MochaWriter
]
// end settings }}

// extends for theme usage, that can be accessable by {{config.xxx}}
exports.package = require(path.join(process.cwd(), 'package.json'))
