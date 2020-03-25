const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");
const LimitSizeStream = require("./LimitSizeStream");

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  if (pathname.split("/").length > 1) {
    res.statusCode = 400;
    res.end("No subfolder");
    return;
  }

  switch (req.method) {
    case "POST":
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
        return;
      }
      const reqData = (req, callback) => {
        let body = [];
        req.on("data", chunk => {
          body.push(chunk);
        });
        req.on("end", () => {
          callback((body = Buffer.concat(body)));
        });
      };

      reqData(req, data => {
        const limitSizeStream = new LimitSizeStream({ limit: 10000 });
        const write = fs.createWriteStream(filepath);
        limitSizeStream.pipe(write);

        limitSizeStream.on("error", () => {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
          res.statusCode = 413;
          res.end();
        });

        limitSizeStream.on("finish", () => {
          res.statusCode = 201;
          res.end();
        });

        if (data.length > 0 && data.length !== undefined) {
          limitSizeStream.write(data);
          limitSizeStream.end();
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
