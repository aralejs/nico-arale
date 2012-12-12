var path = require('path')
var fs = require('fs')
//var nico = require('nico')
var nico = require(path.join(process.env.HOME, 'workspace/node/nico', 'index.js'))

var Post = nico.Post


// {{ settings for nico
exports.theme = __dirname
exports.source = process.cwd()
exports.output = path.join(process.cwd(), '_site')
exports.permalink = '{{directory}}/{{filename}}.html'
exports.ignore = ['_site']
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
    var ret;
    pages.some(function(item) {
      if (item.category == cat) {
        ret = item;
        return true;
      }
    });
    return ret;
  },
  find_all: function(pages, cat) {
    var ret = [];
    pages.forEach(function(item) {
      if (item.category == cat) {
        ret.push(item);
      }
    });
    return ret;
  }
}
exports.functions = {
  render_src: function(writer) {
    var ret = {}, key, relative;
    var base = nico.utils.relativeBase(writer.filepath);
    var src = path.join(process.cwd(), 'src')
    var files = nico.utils.walkdir(src).files;
    files.forEach(function(item) {
      relative = nico.utils.relativePath(item, src);
      key = path.basename(relative);
      if (path.extname(key) === '.js') {
        key = key.slice(0, -3);
        relative = relative.replace(/\\/g, '/');
        ret[key] = base + '/' + relative;
      }
    });
    return JSON.stringify(ret);
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


Post.metadata = ['category']
Object.defineProperty(Post.prototype, 'template', {
  configurable: true,
  get: function() {
    if (this.relative_filepath == 'HISTORY.md') return 'history.html';
    return 'post.html';
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
