#!/usr/bin/env python

try:
    import json
    loads = json.loads
except ImportError:
    import simplejson
    loads = simplejson.loads

import os
import urllib
import tarfile

f = open('package.json')
content = f.read()
f.close()

package = loads(content)

dependencies = None


def fetch(key, value):
    save = key + '.tgz'
    bits = value.split('/')
    url = 'http://modules.spmjs.org/%s/%s.tgz' % ('/'.join(bits[:-1]), bits[1])
    print 'downloading: %s' % url
    urllib.urlretrieve(url, save)

    tar = tarfile.open(save)
    tar.extractall('sea-modules/' + bits[0])
    tar.close()
    dist = os.path.join('sea-modules', bits[0], bits[1], 'dist')
    version = os.path.join('sea-modules', bits[0], bits[1], bits[2])
    try:
        os.rmdir(version)
    except Exception as e:
        pass
    try:
        os.renames(dist, version)
    except Exception as e:
        print e


if "dependencies" in package:
    dependencies = package["dependencies"]

if dependencies:
    for key in dependencies:
        value = dependencies[key]
        if len(value.split('/')) > 3:
            fetch(key, value)
