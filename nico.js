var path = require('path');
var util = require('util');
var fs = require('fs');
var nico = require('nico');
var _ = require(path.join(path.dirname(require.resolve('nico')), 'node_modules', 'underscore'));
var urilib = require('nico/lib/utils/urilib');
var pathlib = require('nico/lib/utils/pathlib');
var Post = nico.Post;


// {{ settings for nico
exports.theme = __dirname
exports.source = process.cwd()
exports.output = path.join(process.cwd(), '_site')
exports.permalink = '{{directory}}/{{filename}}.html'
exports.ignore = ['_site', 'node_modules']
exports.google = 'UA-36247332-1'
exports.writers = [
  nico.PageWriter,
  nico.StaticWriter,
  nico.FileWriter,
  path.join(__dirname, 'theme') + '.MochaWriter'
]
exports.PostRender = Post
exports.filters = {
  debug: function(args) {
    return args.indexOf('debug') != -1;
  },
  find: function(pages, cat) {
    var ret = exports.filters.find_all(pages, cat);
    if (!ret.length) return null;
    return ret[0];
  },
  find_all: function(pages, cat) {
    var ret = [];
    pages.forEach(function(item) {
      if (item.category == cat) {
        ret.push(item);
      }
    });
    ret = _.sortBy(ret, function(i) { return i.meta.order || 0});
    return ret;
  },
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
    var base = urilib.relative(writer.filepath, '');
    return JSON.stringify(findSrc(base.slice(0, -1)));
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
  var files = pathlib.walkdirSync(src);
  var key, relative, ret = {};
  files.forEach(function(item) {
    relative = pathlib.relative(src, item);
    key = path.basename(relative);
    if (path.extname(key) === '.js') {
      key = key.slice(0, -3);
      relative = relative.replace(/\\/g, '/');
      ret[key] = base + '/src/' + relative;
    }
  });
  return ret;
}

Post.metadata = ['category']
Object.defineProperty(Post.prototype, 'template', {
  configurable: true,
  get: function() {
    if (this.relative_filepath == 'HISTORY.md') return 'history.html';
    return this.meta.template || 'post.html';
  }
});

Object.defineProperty(Post.prototype, 'filename', {
  configurable: true,
  get: function() {
    if (this.relative_filepath == 'README.md') return 'index';
    if (this.meta.filename) return this.meta.filename;
    var basename = path.basename(this.relative_filepath);
    return basename.split('.')[0];
  }
});

Object.defineProperty(Post.prototype, 'category', {
  configurable: true,
  get: function() {
    if (this.relative_filepath == 'README.md') return 'docs';
    if (this.meta.category) return this.meta.category;
    return this.directory;
  }
});
