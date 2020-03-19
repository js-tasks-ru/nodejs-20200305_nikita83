const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._tab = "";
  }

  _transform(chunk, encoding, callback) {
    this._tab += chunk.toString("utf-8");
    callback();
  }

  _flush(callback) {
    this._tab.split(os.EOL).map(item => this.push(item));
    callback();
  }
}

module.exports = LineSplitStream;
