const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('Subdirs not supported');
        return;
      }
      fs.exists(filepath, (exists) => {
        if (!exists) {
          res.statusCode = 404;
          res.end('File not found');
          return;
        } else {
          fs.unlink(filepath, (err) => {
            if (err) {
              console.error(err);
            }
            res.statusCode = 200;
            res.end('File deleted');
          });
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
