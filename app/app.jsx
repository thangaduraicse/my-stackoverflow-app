import React from "react";
import { render } from "react-dom";
import Test from "./test";

// Require all css files here
require('materialize-scss');
require('./scss/importer.scss');

render(
 	<Test/>,
 	document.getElementById("root")
);
