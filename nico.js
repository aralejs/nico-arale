var path = require('path');
var util = require('util');
var fs = require('fs');
var nico = require('nico');
var Post = nico.Post;


// {{ settings for nico
exports.theme = __dirname
exports.source = process.cwd()
exports.output = path.join(process.cwd(), '_site')
exports.permalink = '{{directory}}/{{filename}}.html'
exports.ignorefilter = function(filepath, subdir) {
  if (/^(_site|node_modules)/.test(subdir)) {
    return false;
  }
  return true;
}
exports.reader = function(post) {
  var filename = post.meta.filepath.toLowerCase();
  if (filename === 'history.md') {
    post.template = post.meta.template = 'history';
  } else {
    post.template = post.meta.template = 'post';
  }
  if (filename === 'readme.md') {
    post.filename = post.meta.filename = 'index';
    post.meta.category = 'docs';
  }
  if (!post.meta.category) {
    post.meta.category = post.meta.directory;
  }
  return post;
}
exports.google = 'UA-36247332-1'
exports.writers = [
  nico.PageWriter,
  nico.StaticWriter,
  nico.FileWriter,
  require('./theme').MochaWriter
]

exports.filters = {
  debug: function(args) {
    return args.indexOf('debug') != -1;
  },
  find: function(pages, cat) {
    var ret = findCategory(pages, cat);
    if (ret.length) return ret[0];
    return null;
  },
  find_category: findCategory,
  replace_code: function(content) {
    var key, value, regex;
    var src = findSrc();
    var p = exports.package;
    for (key in src) {
      value = util.format('%s/%s/%s/%s', p.root, p.name, p.version, key);
      var regex = new RegExp(
        '<span class="string">(\'|\")' + key + '(\'|\")</span>', 'g'
      );
      content = content.replace(regex, '<span class="string">$1' + value + '$2</span>');
    }
    return content;
  }
}
exports.functions = {
  render_src: function(writer) {
    var base = path.relative(path.dirname(writer.filepath), '');
    return JSON.stringify(findSrc(base));
  }
}
// end settings }}


// extends for theme usage, that can be accessable by {{config.xxx}}
exports.package = require(path.join(process.cwd(), 'package.json'))

if (fs.existsSync(path.join(process.cwd(), 'HISTORY.md'))) {
  exports.hasHistory = true
} else {
  exports.hasHistory = false
}
if (fs.existsSync(path.join(process.cwd(), 'tests'))) {
  exports.hasTest = true
} else {
  exports.hasTest = false
}


function findSrc(base) {
  base = base || '..';
  var src = path.join(process.cwd(), 'src');
  if (!fs.existsSync(src)) return {};

  var key, ret = {};
  nico.sdk.file.recurse(src, function(filepath) {
  });
  return ret;
}

function findCategory(pages, cat) {
  var ret = [];
  Object.keys(pages).forEach(function(key) {
    var item = nico.sdk.post.read(key);
    if (item.meta.category === cat) {
      ret.push(item);
    }
  });
  ret = ret.sort(function(a, b) {
    a = a || 0;
    b = b || 0;
    return parseInt(a, 10) - parseInt(b, 10);
  });
  return ret;
}
