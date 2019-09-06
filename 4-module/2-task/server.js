const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST': {
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('Subdirs not allowed');
        return;
      }

      fs.exists(filepath, (exists) => {
        if (exists) {
          res.statusCode = 409;
          res.end('File already exists.');
          return;
        }

        const lss = new LimitSizeStream({limit: 1048579});
        const ws = fs.createWriteStream(filepath);

        req
            .on('aborted', () => {
              if (fs.existsSync(filepath)) {
                fs.unlink(filepath, (err) => { });
              }
              res.statusCode = 500;
              res.end('Error...');
            })
            .pipe(lss)
            .on('error', (err) => {
              if (err instanceof LimitExceededError) {
                // console.log('catch error');
                if (fs.existsSync(filepath)) {
                  fs.unlink(filepath, (err) => { });
                }
                res.statusCode = 413;
                res.write('File too big! Error.');
                res.end();
                return;
              }
            })
            .pipe(ws)
            .on('finish', () => {
              res.statusCode = 201;
              res.end('File saved');
            });
      });
      return;
    }
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});


module.exports = server;
