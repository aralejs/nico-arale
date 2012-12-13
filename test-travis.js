var fs = require('fs');
var http = require('http');
var static = require('node-static');
var swig = require('swig');

swig.init({
    autoescape: false
});

var package = require(fs.realpathSync('package.json'));
console.log('read package.json');

var tmpl = swig.compileFile(fs.realpathSync('tests/templates/runner.html'));
var result = tmpl.render({
    static_url: function(url) {
        return './static/' + url;
    },
    config: {
        package: package
    },
    site: {
        name: package.name
    },
    theme: {
        debug: true
    }
});
fs.writeFileSync('tests/runner.html', result);
console.log('generate tests/runner.html');

// Server Start
var file = new static.Server(fs.realpathSync('.'));
http.createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    });
}).listen(8000);
console.log('Server start http://127.0.0.1:8000');
