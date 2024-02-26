const header = require("./header");
const errorHandler = (res, statusCode = 400, message = "incorrect url") => {
  res.writeHead(statusCode || 400, header);
  res.write(
    JSON.stringify({ status: "false", message: message || "incorrect url" })
  );
  res.end();
};

module.exports = errorHandler;
