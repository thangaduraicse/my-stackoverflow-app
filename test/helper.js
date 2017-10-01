process.env.NODE_ENV = "test";

require("babel-polyfill");
require("babel-register")();
require("whatwg-fetch");

require.extensions[".css"] = function () {return null;};
require.extensions[".scss"] = function () {return null;};
require.extensions[".png"] = function () {return null;};
require.extensions[".jpg"] = function () {return null;};

const {JSDOM} = require("jsdom");

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const {window} = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === "undefined")
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: "node.js",
};

copyProps(window, global);

const lod = require("lodash");
const {mount, shallow, render} = require("enzyme");
global._ = lod;
global.lod = lod;
global.moment = require("moment");
global.React = require("react");
global.ReactDOM = require("react-dom");
global.PropTypes = require("prop-types");
global.expect = require("chai").expect;
global.mount = mount;
global.shallow = shallow;
global.render = render;
global.parseURL = function(url) {
  let customParser = document.createElement("a");
  customParser.href = url;
  return {
    protocol: customParser.protocol,
    host: customParser.host,
    hostname: customParser.hostname,
    origin: customParser.origin,
    port: customParser.port,
    pathname: customParser.pathname
  };
};
