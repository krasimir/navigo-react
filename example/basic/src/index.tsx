import ReactDOM from "react-dom";
import React from "react";
import { configureRouter } from "navigo-react";

import App from "./components/App";

configureRouter("/app");

ReactDOM.render(<App />, document.querySelector("#container"));
