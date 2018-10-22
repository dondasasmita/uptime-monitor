/*
 * Primary file for the API
*/

// Dependencies
const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const config = require("./config");

// The server responds to all requests
const server = http.createServer((req, res) => {
  // Get URL and parse it
  // Passing true to call the query string module
  let parsedURL = url.parse(req.url, true);

  // Get the path from the URL
  let path = parsedURL.pathname;
  // Trim off all the slashes in the path
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query params as object
  let queryObject = parsedURL.query;

  // Get HTTP method
  let method = req.method.toUpperCase();

  // Get the headers as object
  let headers = req.headers;

  // Get payload , if any
  // Create decoder to utf-8
  let decoder = new StringDecoder("utf-8");

  // Placeholder for the stream
  let buffer = "";

  // When data is received
  req.on("data", data => {
    buffer += decoder.write(data);
  });

  // Upon end event
  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler this request will go to
    let chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      trimmedPath: trimmedPath,
      queryObject: queryObject,
      method: method,
      headers: headers,
      payload: buffer
    };

    // Route the request
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called by the handler or 200 by default
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use payload called back by the payload or default to an empty object
      payload = typeof payload == "object" ? payload : {};

      // Convert payload to String
      let stringPayload = JSON.stringify(payload);

      // Return the response
      res.setHeader("content-type", "application/json");
      res.writeHead(statusCode);

      // Send the response
      res.end(stringPayload);

      // Log the request
      console.log("Returning this reponse: ", statusCode, stringPayload);
    });
  });
});

// Start server
server.listen(config.port, () => {
  console.log(`Listening on port ${config.port} using ${config.envName} mode`);
});

// Define handlers
let handlers = {};

// Sample handle
handlers.sample = (data, callback) => {
  // Callback HTTP status code and a payload object
  callback(406, data);
};

handlers.username = (data, callback) => {
  // Callback HTTP status code and a payload object
  callback(200, { handlername: "hello, username" });
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Define a request router
let router = {
  sample: handlers.sample,
  username: handlers.username,
  notFound: handlers.notFound
};
