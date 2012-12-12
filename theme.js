#!/usr/bin/env node

var path = require('path')
var BaseWriter = require('nico').BaseWriter;


exports.name = 'arale'
exports.version = '0.1'
exports.lang = 'zh'

exports.MochaWriter = BaseWriter.extend({
  writerName: 'MochaWriter',

  run: function() {
    this.render({
      destination: path.join(this.storage.config.output, 'tests', 'runner.html'),
      template: 'mocha-runner.html'
    });
  }
});


exports.JasmineWriter = BaseWriter.extend({
  writerName: 'JasmineWriter',

  run: function() {
    this.render({
      destination: path.join(this.storage.config.output, 'tests', 'runner.html'),
      template: 'jasmine-runner.html'
    });
  }
});
