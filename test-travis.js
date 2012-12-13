var fs = require('fs');
var http = require('http');
var static = require('node-static');

// Server Start
var file = new static.Server(fs.realpathSync('_site'));
http.createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    });
}).listen(8000);
console.log('Server start http://127.0.0.1:8000');
