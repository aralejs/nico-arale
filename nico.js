var path = require('path');


// {{ settings for nico
exports.theme = __dirname
exports.source = process.cwd()
exports.output = path.join(process.cwd(), '_site')
exports.permalink = '{{directory}}/{{filename}}.html'
exports.google = 'UA-36247332-1'
exports.ignorefilter = function(filepath, subdir) {
  if (/^(_site|_theme|node_modules|\.idea)/.test(subdir)) {
    return false;
  }
  return true;
}
exports.writers = [
  'nico.PageWriter',
  'nico.StaticWriter',
  'nico.FileWriter',
  'nico.MochaWriter'
]
// end settings }}

// extends for theme usage, that can be accessable by {{config.xxx}}
exports.assets_host = 'http://assets.spmjs.org';

var pkg = require(path.join(process.cwd(), 'package.json'))
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
  },
  getNickName: function(html) {
    var reg = /^(.*) (.*)$/;
    return html.match(reg)[1];
  }
}
