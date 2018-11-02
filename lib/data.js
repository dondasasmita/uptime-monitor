// Load the dependencies
const fs = require("fs");
const path = require("path");

// Create variable to store the functions
let lib = {};

// Define the base directory where the data will be stored
const baseDirectory = path.join(__dirname, "../.data");

// Define the function to create file in directory
lib.create = (dir, fileName, data, callback) => {
  // Open the file in the directory, throw callback if file exists
  fs.open(
    baseDirectory + "/" + dir + "/" + fileName + ".json",
    "wx",
    (err, fd) => {
      if (!err && fd) {
        // Convert data to String
        let dataString = JSON.stringify(data);
        // Write the file
        fs.writeFile(fd, dataString, err => {
          if (!err) {
            // Close the file
            fs.close(fd, err => {
              if (err) {
                callback("Unable to close file");
              } else {
                callback("File successfully written");
              }
            });
          } else {
            callback("Unable to write file");
          }
        });
      } else {
        callback("Unable to open file, it may exists");
      }
    }
  );
};

// Define function to read data from a file
lib.read = (dir, fileName, callback) => {
  // Read file
  fs.readFile(
    baseDirectory + "/" + dir + "/" + fileName + ".json",
    "utf8",
    (err, data) => {
      if (!err && data) {
        callback(data);
      } else {
        callback("Unable to read file. File might not exist");
      }
    }
  );
};

// Define function to update
lib.update = () => {
  // Open the file
};

// Define function to delete
lib.delete = (dir, fileName, callback) => {
  // Delete file
  fs.unlink(baseDirectory + "/" + dir + "/" + fileName + ".json", err => {
    if (!err) {
      callback("Delete is successful");
    } else {
      callback("Delete is unsiccessful");
    }
  });
};

module.exports = lib;
