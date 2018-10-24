/*
 * Primary file for the API
*/

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const config = require("./config");
const fs = require("fs");

// Instantiate the http server
const httpServer = http.createServer((req, res) => {
  unifiedServerHandler(req, res);
});

// Run server, listen to port
httpServer.listen(config.httpPort, () => {
  console.log(`Listening on port ${config.httpPort} in ${config.envName} mode`);
});

// Define the https options
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
  passphrase: fs.readFileSync("./https/passphrase.txt").toString()
};

// Instantiate the https server
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServerHandler(req, res);
});

// Run server, listen to port
httpsServer.listen(config.httpsPort, () => {
  console.log(
    `Listening on port ${config.httpsPort} in ${config.envName} mode`
  );
});

// Define the function that handles the req and req for both http and https server
const unifiedServerHandler = (req, res) => {
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
};

// Define handlers
let handler = {};

// Define the ping handler
handler.ping = (data, callback) => {
  callback(200, data);
};

// Not found handler
handler.notFound = (data, callback) => {
  callback(404);
};

// Define a request router
let router = {
  ping: handler.ping,
  notFound: handler.notFound
};
