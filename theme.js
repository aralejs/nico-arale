#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var util = require('util');
var nico = require('nico');
var BaseWriter = nico.BaseWriter;


exports.name = 'arale';
exports.version = '0.1';
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

exports.package = require(path.join(process.cwd(), 'package.json'))

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
  },
  render_src: function(writer) {
    var base = path.relative(path.dirname(writer.filepath), '');
    var ret = findSrc(base);
    return JSON.stringify(ret);
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
