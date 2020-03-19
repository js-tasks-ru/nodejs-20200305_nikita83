const stream = require("stream");

const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._count = 0;
    this._limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    const str = chunk.toString("utf-8");
    this._count += str.length;
    this._count <= this._limit
      ? callback(null, str)
      : callback(new LimitExceededError());
 
    }
}

module.exports = LimitSizeStream;
