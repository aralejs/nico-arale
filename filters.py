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
