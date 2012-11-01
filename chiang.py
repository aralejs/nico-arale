from liquidluck.readers.base import Post


class ChiangPost(Post):
    @property
    def date(self):
        return self.updated

    @property
    def filename(self):
        name = super(ChiangPost, self).filename.lower()
        if name == 'readme':
            return 'index'
        return name
