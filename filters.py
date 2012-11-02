from jinja2 import contextfilter


def same_category(posts, category):
    items = []
    for item in posts:
        if item.category == category:
            items.append(item)

    items = sorted(items, key=lambda o: o.order)
    return items


def first_category(posts, category):
    items = []
    for item in posts:
        if item.category == category:
            items.append(item)

    items = sorted(items, key=lambda o: o.order)
    if items:
        return items[0]
    return None


@contextfilter
def src_js(ctx, files):
    from liquidluck.utils import get_relative_base

    writer = ctx.get('writer')
    base = get_relative_base(writer['filepath'])

    dct = {}
    for f in files:
        name = f[f.find('src/') + 4:]
        if 'src/' in f and '/' not in name and name.endswith('.js'):
            dct[name[:-3]] = '%s/src/%s' % (base, name)
    return dct


def json_dumps(dct):
    try:
        import json
    except ImportError:
        import simplejson
        json = simplejson
    return json.dumps(dct)
