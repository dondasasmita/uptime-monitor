/*
* Create Environment for staging or production
*/

// Define the environment objects
const environment = {};

environment.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging"
};

environment.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production"
};

// Define and check current environtment
const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Define the environtment to export, set default to staging environment
const environmentToExport =
  typeof environment[currentEnvironment] == "object"
    ? environment[currentEnvironment]
    : environment.staging;

// Export the module
module.exports = environmentToExport;
