const http = require("http");
const errorHandler = require("./errorHandle");
const successHandler = require("./successHandle");
const { v4: uuidv4 } = require("uuid");
const header = require("./header");
const _ = undefined;
const todoList = [];

const requestListener = (req, res) => {
  const url = req.url;
  const method = req.method;
  const startUrl = url.split("/")[1];
  const id = url.split("/").pop();
  const idIndex = todoList.findIndex((list) => list.id === id);
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  if (startUrl === "todo") {
    if (method === "GET") {
      successHandler(res, _, header, todoList);
    } else if (method === "POST") {
      req.on("end", () => {
        try {
          const message = JSON.parse(body).message;
          if (message !== undefined) {
            todoList.push({ message, id: uuidv4() });
            successHandler(res, 201, header, todoList);
          } else {
            errorHandler(res, _, "incorrect data formate");
          }
        } catch (error) {
          errorHandler(res, _, "incorrect data formate");
        }
      });
    } else if (method === "DELETE") {
      if (idIndex !== -1) {
        todoList.splice(idIndex, 1);
        successHandler(res, _, header, todoList);
      } else if (id === "todo") {
        todoList.length = 0;
        successHandler(res, _, header, todoList);
      } else {
        errorHandler(res, _, "can't find id");
      }
    } else if (method === "PATCH") {
      req.on("end", () => {
        try {
          const message = JSON.parse(body).message;
          if (message !== undefined && idIndex !== -1) {
            todoList[idIndex].message = message;
            successHandler(res, 200, header, todoList);
          } else if (idIndex === -1) {
            errorHandler(res, _, "can't find id");
          } else {
            errorHandler(res, _, "incorrect data formate");
          }
        } catch (error) {
          errorHandler(res, _, "incorrect data formate");
        }
      });
    } else if (method === "OPTIONS") {
      res.writeHead(200, header);
      res.end();
    }
  } else {
    errorHandler(res);
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8099);
