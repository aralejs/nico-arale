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
  },
  replace_code: function(content) {
    var key, value, regex;
    var src = findSrc();
    var p = exports.package;
    for (key in src) {
      console.log(key)
      value = util.format('%s/%s/%s', p.name, p.version, key);
      console.log(value)
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
    var base = nico.utils.relativeBase(writer.filepath);
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
  var files = nico.utils.walkdir(src).files;
  var key, relative, ret = {};
  files.forEach(function(item) {
    relative = nico.utils.relativePath(item, src);
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
