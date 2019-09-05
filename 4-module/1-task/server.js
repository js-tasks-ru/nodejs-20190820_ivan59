const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  // console.log(pathname);
  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'GET':
      fs.exists(filepath, (exists) => {
        if (pathname.split('/').length > 1) {
          res.statusCode = 400;
          res.end('No subdir');
        }
        if (exists) {
          res.statusCode = 200;
          fs.createReadStream(filepath).pipe(res);
        } else {
          res.statusCode = 404;
          res.end('No such file');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
