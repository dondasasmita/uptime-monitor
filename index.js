/*
 * Primary file for the API
*/

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// The server responds to all requests
const server = http.createServer((req, res) => {
  // Get URL and parse it
  let parsedURL = url.parse(req.url, true);

  // Get the path from the URL
  let path = parsedURL.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query params as object
  let queryObject = parsedURL.query;

  // Get HTTP method
  let method = req.method.toUpperCase();

  // Get the headers as object
  let headers = req.headers;

  // Send the response
  res.end("Hello\n");

  // Log the request
  console.log("Request received with these headers: ", headers);
});

// Start server and listen on port 3000
server.listen(3000, () => {
  console.log("Listening on port 3000");
});
