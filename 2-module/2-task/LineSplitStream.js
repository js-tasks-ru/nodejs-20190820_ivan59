const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.line = '';
  }

  _transform(chunk, encoding, callback) {
    const splitedChunk = String(chunk).split(os.EOL);
    if (splitedChunk.length === 1) {
      this.line += splitedChunk[0];
      callback(null, '');
    } else {
      const line = this.line + splitedChunk[0];
      this.line = splitedChunk[1];
      callback(null, line);
    }
  }

  _flush(callback) {
    callback(null, this.line);
  }
}

module.exports = LineSplitStream;
