#!/usr/bin/env python

import os
from liquidluck.writers.base import BaseWriter
from liquidluck.readers.base import Post
from liquidluck.options import g
try:
    import json
    _json_decode = json.loads
except ImportError:
    import simplejson
    _json_decode = simplejson.loads


class ChiangPost(Post):
    @property
    def category(self):
        return self.folder

    @property
    def date(self):
        return self.updated

    @property
    def filename(self):
        name = super(ChiangPost, self).filename.lower()
        if name == 'readme':
            return 'index'
        return name


class PackageWriter(BaseWriter):
    writer_name = 'package'

    def __init__(self):
        path = os.path.join(g.source_directory, 'package.json')
        if os.path.exists(path):
            f = open(path)
            g.resource['package'] = _json_decode(f.read())
            f.close()
        else:
            g.resource['package'] = {}
            logging.warn('package.json not found.')

    def start(self):
        pass


class TestWriter(BaseWriter):
    writer_name = 'test'

    def start(self):
        dest = os.path.join(g.output_directory, 'tests', 'runner.html')
        self.render({}, 'runner.html', dest)
