# Theme for Arale Documentation

---

这是一个为 [aralejs.org](http://aralejs.org) 文档设计的 [nico](http://lab.lepture.com/nico/) 主题。


## 安装

### 1. 安装 node



### 2. 安装 nico

参考 http://lab.lepture.com/nico/zh/

另外，如果你安装了 socket.io 的话，将有 livereload 功能。

```
$ npm install socket.io -g
```

### 3. 安装 arale theme



## 使用说明


- `make build-doc` 用于生成文档。
- `make debug` 是开启本地服务器，可用来预览文档，并提供自动构建和 live reload 支持。
- `make server` 是开启本地服务器的调试模式，可直接从本地加载依赖的文件。


## 文档编辑

nico 支持将 Markdown 文档转换成 HTML 文件，支持的语法请参考：[Markdown Syntax](http://daringfireball.net/projects/markdown/syntax)

nico 还支持一些扩展语法，包括标题、元信息等。

```
# 标题

- order: 1

---------------

分割线一定得有的哦，分割线下面是内容。
```

nico 还会用到模块根目录下的 package.json 文件，具体项的含义请参考：[spm package.json](https://github.com/spmjs/spm/wiki/package.json)

其中 ``repository.url`` 用来生成 View the Project 链接， ``bugs.url`` 用来生成讨论链接。


### 特有功能

用三个 ` 会高亮显示代码

    ```js
    function something() {
    }
    ```

用四个 ` 会高亮显示代码，还会将代码插入到生成的 HTML 页面中

    ````js
    function something() {
    }
    ````

跨文档链接 ([[title]])

    可查看 [[另一篇文章的标题]]

插入 iframe

    ````iframe
    <link rel="stylesheet" href="css/some.css">
    <button>click</button>
    <script>
        seajs.use('jquery', function($) {
            $('button').click(function() { alert('hello'); })
        });
    </script>
    ````

还可以设置 iframe 的高度

    ````iframe:400
    ````

生成 iframe 的模板是 `templates/iframe.html`，不用写头写尾。



## 输出

假设模块的目录结构为：

```
package.json
Makefile
src/
    hello-world.js
examples/
    hello-world.md
docs/
    hello-world.md
README.md
```

执行 `make doc` 后会生成：

```
package.json
Makefile
_site/
    index.html
    src/
        hello-world.js
    examples/
        hello-world.html
    docs/
        hello-world.html
src/
    hello-world.js
examples/
    hello-world.md
docs/
    hello-world.md
README.md
```

所有生成的文件都在 _site 目录下。
