#!/usr/bin/env node

var path = require('path')
var writer = require('/Users/lepture/workspace/node/nico/lib/writer')


exports.name = 'arale'
exports.version = '0.1'
exports.lang = 'zh'

exports.MochaWriter = writer.BaseWriter.extend({
  writerName: 'MochaWriter',

  run: function() {
    this.render({
      destination: path.join(this.storage.config.output, 'tests', 'runner.html'),
      template: 'mocha-runner.html'
    });
  }
});


exports.JasmineWriter = writer.BaseWriter.extend({
  writerName: 'JasmineWriter',

  run: function() {
    this.render({
      destination: path.join(this.storage.config.output, 'tests', 'runner.html'),
      template: 'jasmine-runner.html'
    });
  }
});
