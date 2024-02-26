const successHandler = (res, statusCode = 200, header, data) => {
  res.writeHead(statusCode || 200, header);
  res.write(JSON.stringify({ status: "success", data }));
  res.end();
};

module.exports = successHandler;
