#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var util = require('util');
var nico = require('nico');
var file = nico.sdk.file;
var BaseWriter = nico.BaseWriter;


exports.name = 'arale';
exports.version = '1.0';
exports.lang = 'zh';

function MochaWriter() {}
util.inherits(MochaWriter, BaseWriter);

MochaWriter.prototype.run = function() {
  var option = nico.sdk.option;
  var dest = path.join(option.get('outputdir'), 'tests', 'runner.html');
  this.render({
    destination: dest,
    template: 'mocha-runner.html'
  });
}
exports.MochaWriter = MochaWriter;

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

var pkg = require(path.join(process.cwd(), 'package.json'))

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
    var p = pkg;
    for (key in src) {
      value = util.format('%s/%s/%s/%s', p.family, p.name, p.version, key);
      var regex = new RegExp(
        '<span class="string">(\'|\")' + key + '(\'|\")</span>', 'g'
      );
      content = content.replace(regex, '<span class="string">$1' + value + '$2</span>');
    }
    return content;
  },
  output_alias: function(pkg) {
    if (pkg.spm && pkg.spm.output) {
      var ret = {};
      (pkg.spm.output || []).forEach(function(fname) {
        if (fname.indexOf('*') !== -1) {
          return;
        }
        if (/\.js$/.test(fname)) {
          fname = fname.replace(/\.js$/, '');
          ret[fname] = pkg.family + '/' + pkg.name + '/' + pkg.version + '/' + fname;
        }
      });
      return ret;
    }
    return {};
  },
  render_src: function(writer) {
    var base = path.relative(path.dirname(writer.filepath), '');
    var ret = findSrc(base);
    return JSON.stringify(ret);
  }
}

exports.functions = {
  dist_files: function() {
    var dist = path.join(process.cwd(), 'dist');
    var ret = {
      js: [],
      css: []
    };
    file.recurse(dist, function(fpath) {
      var fname = path.relative(dist, fpath).replace(/\\/g, '/');
      if (fname.indexOf('-debug') !== -1) return;
      if (/\.js$/.test(fname)) {
        ret.js.push(fname);
      } else if (/\.css$/.test(fname)) {
        ret.css.push(fname);
      }
    });
    return ret;
  },

  src_files: function() {
    var srcdir = path.join(process.cwd(), 'src');
    var ret = {
      js: [],
      css: [],
      alias: {}
    };
    file.recurse(srcdir, function(fpath) {
      var fname = path.relative(srcdir, fpath).replace(/\\/g, '/');
      var key;
      if (/\.js$/.test(fname)) {
        ret.js.push(fname);
        key = fname.replace(/\.js$/, '');
        ret.alias[key] = fname;
      } else if (/\.css$/.test(fname)) {
        ret.css.push(fname);
        key = fname.replace(/\.css$/, '');
        ret.alias[key] = fname;
      }
    });
    return ret;
  },

  spec_files: function() {
    var rootdir = path.join(process.cwd(), 'tests');
    var ret = [];
    file.recurse(rootdir, function(fpath) {
      var fname = path.relative(rootdir, fpath).replace(/\\/g, '/');
      if (fname.indexOf('-spec') !== -1) {
        ret.push(fname);
      }
    });
    return ret;
  },

  engines: function() {
    var ret = [];
    if (pkg.spm && pkg.spm.engines) {
      var engines = pkg.spm.engines;
      Object.keys(engines).forEach(function(key) {
        var js = engines[key];
        if (/\.js$/.test(js)) {
          ret.push(js);
        } else {
          ret.push(js + '.js');
        }
      });
    }
    return ret;
  }
}

exports.hasHistory = fs.existsSync(path.join(process.cwd(), 'HISTORY.md'));
exports.hasTest = fs.existsSync(path.join(process.cwd(), 'tests'));


function findSrc(base) {
  if (base === undefined) {
    base = '..';
  }
  if (base === '') {
    base = '.';
  }
  var src = path.join(process.cwd(), 'src');
  if (!fs.existsSync(src)) return {};

  var ret = {};
  nico.sdk.file.recurse(src, function(filepath) {
    var filename = path.relative(src, filepath);
    var key = path.basename(filename);
    key = key.replace(/\.js$/, '');
    ret[key] = base + '/src/' + filename;
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
