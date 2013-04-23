var data = '';

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
  data += chunk;
});

process.stdin.on('end', function () {
  var files = JSON.parse(data.replace(/^[^{]*({)/g, '$1')).files;
  for (var i in files) {
    var file = files[i];
    process.stdout.write('SF:' + file.filename + '\n');
    for (var num in file.source) {
      if (file.source[num].coverage !== '') {
        process.stdout.write('DA:' + num + ',' + file.source[num].coverage + '\n');
      }
    }
    process.stdout.write('end_of_record\n');
  }
});
