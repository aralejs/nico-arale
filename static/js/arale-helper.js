;(function() {
  if (location.href.indexOf('examples') > 0 || location.href.indexOf('tests') > 0 ||
      location.href.indexOf('docs') > 0) {
    var PAGE_ROOT = '..'
  } else {
    var PAGE_ROOT = '.'
  }
  var CDN_MODULES = [
    'jquery', 'zepto', 'json', 'jasmine', 'underscore', 'handlebars',
    'seajs', 'moment', 'async', 'store', 'swfobject', 'backbone', 'raphael'
  ]

  var ALIPAY_BASE = 'http://static.alipayobjects.com/static/arale/'
  var GITHUB_BASE = 'https://raw.github.com/aralejs/'
  var PACKAGE = {}

  var mapRules = []
  mapRules.push(function(url) {

    // CDN_MODULES 直接从 alipay 的 cdn 上加载
    for (var i = 0; i < CDN_MODULES.length; i++) {
      if (url.indexOf(CDN_MODULES[i] + '/') > 0) {
        return url.replace(GITHUB_BASE, ALIPAY_BASE)
      }
    }

    // 将 "/master/xxx.js" 转换成 "/master/dist/xxx.js"
    url = url.replace(/\/master\/([^\/]+\.js)$/, '/master/dist/$1')

    // 将 "/1.0.2/xxx.js" 转换成 "/1.0.2/dist/xxx.js"
    url = url.replace(/\/([\d\.]+)\/([^\/]+\.js)$/, '/$1/dist/$2')

    // 本地开发中的文件，直接从本地加载
    if (url.indexOf('src') < 0 && url.indexOf('dist') < 0) {
      var module = url.replace(GITHUB_BASE, '')
      url = url.replace(GITHUB_BASE, PAGE_ROOT + '/src/')
    }

    // 如果访问 alipay.im 则从 git.alipay.im 加载
    if ((location.hostname.indexOf('alipay.im') != -1 || location.hostname.indexOf('127.0.0.1') != -1 || location.hash == '#gitlab')
        && url.indexOf(GITHUB_BASE) != -1) {
          // 链接转换成 http://arale.alipay.im/source/overlay/0.9.9/overlay.js
          url = url.replace(GITHUB_BASE, 'http://arale2.alipay.im/source/')
          url = url.replace('dist/', '')
        }

        return url
  })

  seajs.config({
    base: GITHUB_BASE,
    alias: {
      '$': 'jquery/1.7.2/jquery',
      '$-debug': 'jquery/1.7.2/jquery-debug',

      'jquery': 'jquery/1.7.2/jquery',
      'jquery-debug': 'jquery/1.7.2/jquery-debug',

      'zepto': 'https://a.alipayobjects.com/static/handy/zepto/0.9.0/zepto.js',
      '_': 'underscore/1.3.3/underscore'

    },
    preload: [
      'seajs/plugin-json',
      'seajs/plugin-text'
    ]
  })
  if (seajs._nicodebug) {
    seajs.config({
      base: '/sea-modules'
    })
  } else {
    seajs.config({
      map: mapRules
    })
  }

  var aliasIsParsed = false
  var _use = seajs.use

  if (location.href.indexOf('/tests/runner.html') > -1 ||
      location.href.indexOf('/examples') > -1) {

    seajs.use = function(ids, callback) {
      // 确保 package.json 加载前，plugin-json 已加载完成
      _use(['seajs/plugin-json'], function() {
        _use(PAGE_ROOT + '/package.json', function(data) {

          if (aliasIsParsed === false) {
            PACKAGE = data
            // 有可能存在 { '$': '$' } 配置，需排除掉
            data.dependencies && (delete data.dependencies['$'])
            data.devDependencies && (delete data.devDependencies['$'])

            seajs.config({ alias: data.dependencies })
            seajs.config({ alias: data.devDependencies })

            aliasIsParsed = true
            seajs.use = _use
          }

          _use(ids, callback)
        })
      })
    }
  }
})();

seajs.use(['jquery'], function($) {
  $(function(){
    $('h4 em').parent().addClass('doc-api')
  });
})
