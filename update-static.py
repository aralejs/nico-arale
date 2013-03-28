#!/usr/bin/env python
# coding: utf-8

import urllib
import subprocess

MOCHA = "http://modules.spmjs.org/gallery/mocha/1.8.1/mocha.js"
PUERH = "https://raw.github.com/popomore/puerh/%s/puerh.js" % "0.0.1"
SINON = "http://sinonjs.org/releases/sinon-%s.js" % "1.5.2"


def fetch(url, filename, replace=None):
    print 'fetching: %s' % url
    f = urllib.urlopen(url)
    content = f.read()
    f.close()
    if replace:
        content = replace(content)
    f = open(filename, 'w')
    f.write(content)
    f.close()


fetch(
    MOCHA, 'tmp/mocha.js',
    lambda o: o.replace('window.scrollTo', '// window.scrollTo')
)
fetch(
    "https://raw.github.com/visionmedia/mocha/%s/mocha.css" % "1.7.4",
    'static/css/mocha.css'
)
fetch(PUERH, 'tmp/puerh.js')
fetch(SINON, 'tmp/sinon.js')


subprocess.call(
    [
        'uglifyjs',
        'tmp/mocha.js',
        '-o', 'static/js/mocha.js'
    ]
)
subprocess.call(
    [
        'uglifyjs',
        'tmp/sinon.js',
        'tmp/puerh.js',
        '-o', 'static/js/test-suite.js'
    ]
)
