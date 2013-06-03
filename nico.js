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
var pkg = require(path.join(process.cwd(), 'package.json'))
if (pkg.keywords && pkg.keywords.indexOf('alipay') !== -1) {
  exports.assets_host = 'http://yuan.alipay.im/assets';
} else {
  exports.assets_host = 'http://assets.spmjs.org';
}
if (['alipay'].indexOf(pkg.family) !== -1) {
  exports.assets_host = 'http://yuan.alipay.im/assets';
}
exports.package = pkg;

exports.filters = {
  fixlink: function(html) {
    // format permalink, ends without .html
    html = html.replace(/(href="[^"]+)\.md(">)/ig, "$1.html$2");
    return html;
  },
  fixIssues: function(html) {
    // format permalink, ends without .html
    html = html.replace(/\s#([0-9]+)/ig, '<a href="'+pkg.bugs.url+'/$1">#$1</a>');
    return html;
  }
}
