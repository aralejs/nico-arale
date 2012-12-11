var path = require('path')
var fs = require('fs')

var nico = '/Users/lepture/workspace/node/nico'
var Post = require(nico).Post

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
    if (this.relative_filepath == 'README.md') return 'index.md';
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



// {{ settings for nico
exports.theme = __dirname
exports.source = process.cwd()
exports.output = path.join(process.cwd(), '_site')
exports.permalink = '{{directory}}/{{filename}}.html'
exports.ignore = ['_site']
exports.writers = [
  nico + '.PageWriter',
  nico + '.StaticWriter',
  nico + '.FileWriter',
  path.join(__dirname, 'theme') + '.MochaWriter'
]
exports.PostRender = Post
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
