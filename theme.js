#!/usr/bin/env node

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
  var dest = path.join(nico.option('outputdir'), 'tests', 'runner.html');
  this.render({
    destination: dest,
    template: 'mocha-runner.html'
  });
}
