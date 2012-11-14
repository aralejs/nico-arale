# Theme for Arale Documentation

---

这是一个为 [aralejs.org](http://aralejs.org) 文档设计的 liquidluck 主题。

liquidluck 是一个文档生成和预览工具，官方首页：<http://lab.lepture.com/liquidluck/>



## 安装

### 准备工作

1. Mac 用户需要安装 Xcode 以及 Xcode 里的 Command Line Tools：[安装方法](http://stackoverflow.com/questions/9329243/xcode-4-4-command-line-tools)
2. Linux 用户需要安装 python-dev，例如：`sudo apt-get install python-dev`
3. 如果没有 pip，请先安装，或用 `easy_install` 代替 `pip install`

### 安装 liquidluck

```
$ sudo pip install -U liquidluck
```

为了让文档预览功能可用，还需要安装 tornado：

```
$ sudo pip install -U tornado
```

### 安装 aralejs theme

```
$ liquidluck install aralejs/ -g
```

这样，aralejs theme 就安装到了用户目录：`~/.liquidluck-themes/aralejs/`

当主题有更新时，可以通过该命名直接更新。



## 使用说明

建议在需要使用 liquidluck 的模块下创建 Makefile 文件，包含以下命令：

```
$(THEME) = $(HOME)/.liquidluck-themes/aralejs

doc:
    liquidluck build -s $(THEME)/settings.yml

server:
    liquidluck server -s $(THEME)/settings.yml

debug:
    liquidluck server -d -s $(THEME)/settings.yml
```

- `make doc` 用于生成文档。
- `make server` 是开启本地服务器，可用来预览文档，并提供自动构建和 live reload 支持。
- `make debug` 是开启本地服务器的调试模式，可直接从本地加载依赖的文件。


## 文档编辑

liquidluck 支持将 Markdown 文档转换成 HTML 文件，支持的语法请参考：[Markdown Syntax](http://daringfireball.net/projects/markdown/syntax)

liquidluck 还支持一些扩展语法，包括标题、元信息等。

```
# 标题

- order: 1

---------------

分割线一定得有的哦，分割线下面是内容。
```

liquidluck 还会用到模块根目录下的 package.json 文件，具体项的含义请参考：[spm package.json](https://github.com/seajs/spm/wiki/package.json)

其中 ``repository.url`` 用来生成 View the Project 链接， ``bugs.url`` 用来生成讨论链接。


### 特有功能

1. 用三个 ` 会高亮显示代码

    ```js
    function something() {
    }
    ```

2. 用四个 ` 会高亮显示代码，还会将代码插入到生成的 HTML 页面中

    ````js
    function something() {
    }
    ````

3. 跨文档链接 ([[title]])

    可查看 [[另一篇文章的标题]]


4. 插入 iframe

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

生成 iframe 的模板是 templates/iframe.html，不用写头写尾。



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


## 写给 Windows 用户

### 安装 Cygwin

去 [cygwin](http://www.cygwin.com) 下载安装，选择以下包安装：

1. python interpreters 2.6
2. make （Devel -- the GNU version of 'make')
3. gcc (gcc-core 和 gcc-g++)
4. git （Devel -- Fast Version Control …)
5. ca-certificates

### 安装 liquidluck

1. 下载 [setuptools](http://pypi.python.org/pypi/setuptools) py2.6.egg 这个
2. 打开 cygwin terminal 执行 ``sh setuptools-xxx.egg`` (建议将 setuptools 放到 ~ 下)
3. 安装 pip (easy_install pip)
4. 安装 liquidluck (pip install -U liquidluck)
5. 安装 tornado (pip install -U tornado)

### 跑起来

1. 安装主题 liquidluck install aralejs/ -g
2. 和上面一样，增加 Makefile 文件
3. 然后就可以用 `make doc` 和 `make server` 等命令了


有任何使用上的疑问，请通过 Issue 反馈给我们。
