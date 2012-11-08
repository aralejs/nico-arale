# Arale2 theme for Felix Felicis

------------

为 [aralejs](http://aralejs.org) 文档设计的主题。


## 安装

如果没有 pip，请用 ``easy_install`` 代替 ``pip install``。

Mac 用户需要安装 Xcode 以及 Xcode 里的 command line tools。

Linux 用户请注意，如果系统没带 python-dev，请自行安装，例如：
``sudo apt-get install python-dev``


1. 安装 liquidluck

        $ sudo pip install -U liquidluck

2. 安装 tornado (live preview server)

        $ sudo pip install -U tornado

3. 安装 arale2 主题 (更新主题也是该命令)

        $ liquidluck install alipay/arale2 -g


## 命名别名

建议在项目下创建 Makefile

```
build:
    liquidluck build -s ~/.liquidluck-themes/arale2/settings.yml

server:
    liquidluck server -d -s ~/.liquidluck-themes/arale2/settings.yml
```

然后用 make build 和 make server 就可以了。


## 编辑

文档写作支持标题、元信息以及内容。

例如:

```
# 标题

- order: 1

---------------

分割线一定得有的哦，分割线下面是内容。
```

### package.json

请参考 [spm package.json](https://github.com/seajs/spm/wiki/package.json)。

其中 ``repository.url`` 用来生成 View the Project 链接， ``bugs.url`` 用来生成讨论链接。


### 特性

代码高亮 (三个 `)

    ```js
    function something() {
    }
    ```

既高亮显示代码，又将代码插入到页面中 (四个 `)

    ````js
    function something() {
    }
    ````

跨文档链接 ([[title]])

    可查看 [[另一篇文章的标题]]


插入 iframe

    ````iframe
    <link rel="stylesheet" href="css/some.css" />
    <button>click</button>
    <script type="text/javascript">
        seajs.use('jquery', function($) {
            $('button').click(function() { alert('hello'); })
        });
    </script>

还可以设置 iframe 的高度

    ````iframe:400
    ````

生成 iframe 的模板是 templates/iframe.html，你不用写头写尾。

## 生成文档

arale 目录结构：

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

执行 ``make build`` 后生成：

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

请在 .gitignore 中忽略掉 ``_site`` 目录。

## 测试

你可以使用 ``make server`` 来启动一个服务，这个 server 有 livereload 的功能，当你保存 markdown 文件时，浏览器会自动刷新。

```
$ make server
```


# Windows 用户

## 安装 Cygwin

去 [cygwin](http://www.cygwin.com) 下载安装，选择以下包安装：

1. python interpreters 2.6
2. make （Devel -- the GNU version of 'make')
3. gcc (gcc-core 和 gcc-g++)
4. git （Devel -- Fast Version Control …)
5. ca-certificates

## 安装 liquidluck

1. 下载 [setuptools](http://pypi.python.org/pypi/setuptools) py2.6.egg 这个
2. 打开 cygwin terminal 执行 ``sh setuptools-xxx.egg`` (建议将 setuptools 放到 ~ 下)
3. 安装 pip (easy_install pip)
4. 安装 liquidluck (pip install -U liquidluck)
5. 如果要有 livereload 功能，需要安装 tornado (pip install -U tornado)
6. 如果要写 rst 需要安装 docutils (pip install docutils)

## 跑起来

1. 安装主题 liquidluck install alipay/arale2 -g
2. git clone git://github.com/aralejs/calendar.git
3. cd calendar
4. make server

查看一下 Makefile

另外， ``spm install`` 一下，用 ``make debug`` 可加速。
