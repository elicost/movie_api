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

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello, Node!\n');
}).listen(3000);

console.log('My first Node test server is running on Port 3000.');