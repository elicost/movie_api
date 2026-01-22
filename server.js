const http = require('http');

const url = require('url');

const fs = require('fs');

http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello, Node!\n');
}).listen(3000);

console.log('My first Node test server is running on Port 3000.');