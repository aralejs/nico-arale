;(function() {
  var CDN_MODULES = [
    'jquery', 'zepto', 'json', 'jasmine', 'underscore', 'handlebars',
    'seajs', 'moment', 'async', 'store', 'swfobject', 'backbone', 'raphael'
  ]

  var ALIPAY_BASE = 'http://static.alipayobjects.com/static/arale/'
  var ARALE_BASE = 'http://aralejs.org:7000/'
  var PACKAGE = {}

  var mapRules = []
  mapRules.push(function(url) {

    // 线上还没有 gallery 目录，定位到 arale 中去
    url = url.replace(ARALE_BASE + 'gallery/', ARALE_BASE);

    // CDN_MODULES 直接从 alipay 的 cdn 上加载
    for (var i = 0; i < CDN_MODULES.length; i++) {
      if (url.indexOf(CDN_MODULES[i] + '/') > 0) {
        return url.replace(ARALE_BASE, ALIPAY_BASE)
      }
    }

    // 如果访问 alipay.im 则从 alipay.im 加载
    if ((location.hostname.indexOf('alipay.im') != -1 || location.hash == '#alipay'
        || (seajs._package && seajs._package.root !== 'arale'))
        && url.indexOf(ARALE_BASE) != -1) {
        // 链接转换成 http://arale.alipay.im/source/overlay/0.9.9/overlay.js
        url = url.replace(ARALE_BASE, 'http://aralejs.alipay.im/source/')
        return url;
    } 

    // 如果是线上demo，则走下面的流程
    
    /* 原来转换 github 的链接地址的，现在不需要了

    url = url.replace(ARALE_BASE + 'arale/', ARALE_BASE);

    // 将 "/master/xxx.js" 转换成 "/master/dist/xxx.js"
    url = url.replace(/\/master\/([^\/]+\.js)$/, '/master/dist/$1')

    // 将 "/1.0.2/xxx.js" 转换成 "/1.0.2/dist/xxx.js"
    url = url.replace(/\/([\d\.]+)\/([^\/]+\.js)$/, '/$1/dist/$2')

    */

    return url

  })

  seajs.config({
    base: ARALE_BASE,
    alias: {
      '$': 'https://a.alipayobjects.com/static/arale/jquery/1.7.2/jquery.js',
      '$-debug': 'https://a.alipayobjects.com/static/arale/jquery/1.7.2/jquery-debug.js',

      'jquery': 'https://a.alipayobjects.com/static/arale/jquery/1.7.2/jquery',
      'jquery-debug': 'https://a.alipayobjects.com/static/arale/jquery/1.7.2/jquery-debug.js',

      'zepto': 'https://a.alipayobjects.com/static/handy/zepto/0.9.0/zepto.js'
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
})();

seajs.use(['jquery'], function($) {
  $(function(){
    $('h4 em, h3 em').parent().addClass('doc-api')
    // 给 iframe 加链接
    $('.ff-iframe').each(function(i, item) {
      var src = $(item).find('iframe').attr('src')
      var html = '<a class="new-window" target="_blank" href="' + src + '">新窗口打开</a>'
      $(item).append(html)
    });
    // 给 code 加收起和展开
    $('.highlight').each(function(i, item) {
      var $item = $(item)
      if ($item.height() > 400) {
        $item.append('<a class="code-toggle" href="#">展开</a>')
        $item.addClass('collapse')
      }
    });
  });
  $('.highlight').on('click', '.code-toggle', function() {
    var pre = $(this).parents('.highlight')
    if (pre.hasClass('collapse')) {
      pre.removeClass('collapse')
      $(this).text('收起')
    } else {
      pre.addClass('collapse')
      $(this).text('展开')
    }
    return false
  });
})

// iOS scaling bug fix
// Rewritten version
// By @mathias, @cheeaun and @jdalton
// Source url: https://gist.github.com/901295
;(function(doc) {
  var addEvent = 'addEventListener',
      type = 'gesturestart',
      qsa = 'querySelectorAll',
      scales = [1, 1],
      meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];
  function fix() {
    meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
    doc.removeEventListener(type, fix, true);
  }
  if ((meta = meta[meta.length - 1]) && addEvent in doc) {
    fix();
    scales = [0.25, 1.6];
    doc[addEvent](type, fix, true);
  }
})(document);
