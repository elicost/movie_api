const http = require('http'),
    url = require('url'),
    fs = require('fs');

http.createServer((request, response) => {
    let addr = request.url,
    q = new URL(addr, 'htt://' + request.headers.host),
    filePath = '';

    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documenatation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(data);
        response.end();
    });

}).listen(3000);

console.log('My test server is running on Port 3000.');