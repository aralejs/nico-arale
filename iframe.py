# -*- coding: utf-8 -*-
'''
:copyright: (c) 2012 by Hsiaoming Yang (aka lepture)
:license: BSD
'''


import re
import os
import logging
import misaka as m

from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import get_lexer_by_name

from liquidluck.readers.base import BaseReader
from liquidluck.readers.markdown import escape, JuneRender
from liquidluck.options import settings, g
from liquidluck.utils import to_unicode


_ARALE_IFRAME_COUNT = 0
_ARALE_BEFORE_FILE = None
_ARALE_CURRENT_FILE = None


def generate_iframe(text, height=None):
    if 'iframe' not in g.resource:
        g.resource['iframe'] = {}

    global _ARALE_CURRENT_FILE, _ARALE_BEFORE_FILE, _ARALE_IFRAME_COUNT

    if _ARALE_CURRENT_FILE != _ARALE_BEFORE_FILE:
        _ARALE_BEFORE_FILE = _ARALE_CURRENT_FILE
        _ARALE_IFRAME_COUNT = 0

    _ARALE_IFRAME_COUNT += 1
    key = os.path.splitext(_ARALE_CURRENT_FILE)[0]
    key = '%s-%s' % (key.replace(os.path.sep, '-'), _ARALE_IFRAME_COUNT)
    g.resource['iframe'][key] = {'text': text, 'height': height}
    return key


class MarkdownReader(BaseReader):
    SUPPORT_TYPE = ['md', 'mkd', 'markdown']

    def render(self):
        global _ARALE_CURRENT_FILE
        _ARALE_CURRENT_FILE = self.relative_filepath

        f = open(self.filepath)
        logging.debug('read ' + self.relative_filepath)

        header = ''
        body = ''
        recording = True
        for line in f:
            if recording and line.startswith('---'):
                recording = False
            elif recording:
                header += line
            else:
                body += line

        f.close()
        body = to_unicode(body)
        meta = self._parse_meta(header, body)
        content = self._parse_content(body)
        post = self.post_class(self.filepath, content, meta=meta)
        return post

    def _parse_content(self, body):
        return markdown(body)

    def _parse_meta(self, header, body):
        header = m.html(to_unicode(header))
        titles = re.findall(r'<h1>(.*)</h1>', header)
        if not titles:
            logging.error('There is no title')
            title = None
        else:
            title = titles[0]

        meta = {'title': title}
        items = re.findall(r'<li>(.*?)</li>', header, re.S)
        for item in items:
            index = item.find(':')
            key = item[:index].rstrip()
            value = item[index + 1:].lstrip()
            meta[key] = value

        #: keep body in meta data as source text
        meta['source_text'] = body
        _toc = m.Markdown(m.HtmlTocRenderer(), 0)
        meta['toc'] = _toc.render(body)
        return meta


class AraleRender(JuneRender):
    def block_code(self, text, lang):
        if not lang or lang == '+' or lang == '-':
            return '\n<pre><code>%s</code></pre>\n' % escape(text.strip())

        hide = lang.endswith('-')
        inject = lang.endswith('+') or lang.endswith('-')
        if inject:
            lang = lang[:-1]

        inject = inject and lang in ('javascript', 'js', 'css', 'html')

        html = ''
        if inject:
            if lang == 'javascript' or lang == 'js':
                tpl = '\n<script>\n%s</script>\n'
            elif lang == 'css':
                tpl = '\n<style>\n%s</style>\n'
            else:
                tpl = '\n<div class="insert-code">%s</div>\n'

            html = tpl % text

        #: special handle for iframe
        # ````iframe
        if lang.startswith('iframe'):
            height = None
            if ':' in lang:
                try:
                    height = int(lang.split(':')[1])
                except:
                    height = None
            lang = 'html'
            key = generate_iframe(text, height)
            html = '[[iframe:%s]]' % key

        if hide and inject:
            return html

        variables = settings.reader.get('vars') or {}
        lexer = get_lexer_by_name(lang, stripall=True)
        formatter = HtmlFormatter(
            noclasses=variables.get('highlight_inline', False),
            linenos=variables.get('highlight_linenos', False),
        )
        html += highlight(text, lexer, formatter)
        return html


def markdown(text):
    text = to_unicode(text)
    regex = re.compile(r'^````(\w+)', re.M)
    text = regex.sub(r'````\1+', text)
    regex = re.compile(r'^`````(\w+)', re.M)
    text = regex.sub(r'`````\1-', text)

    render = AraleRender(flags=m.HTML_USE_XHTML | m.HTML_TOC)
    md = m.Markdown(
        render,
        extensions=(
            m.EXT_FENCED_CODE | m.EXT_AUTOLINK | m.EXT_TABLES |
            m.EXT_NO_INTRA_EMPHASIS | m.EXT_STRIKETHROUGH
        ),
    )
    return md.render(text)
