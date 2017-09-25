process.env.NODE_ENV = "test";

require("babel-register")();

require.extensions[".css"] = function () {return null;};
require.extensions[".scss"] = function () {return null;};
require.extensions[".png"] = function () {return null;};
require.extensions[".jpg"] = function () {return null;};

var jsdom = require("jsdom").jsdom;
var lod = require("lodash");

var exposedProperties = ["window", "navigator", "document"];

global.document = jsdom("");
global._ = lod;

global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.parseURL = function(url) {
  var customParser = document.createElement("a");
  customParser.href = url;
  return {
    protocol: customParser.protocol,
    host: customParser.host,
    hostname: customParser.hostname,
    origin: customParser.origin,
    port: customParser.port,
    pathname: customParser.pathname
  };
}

global.navigator = {
  userAgent: "node.js"
};

documentRef = document;
