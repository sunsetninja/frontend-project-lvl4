import "core-js/stable/index.js";
import "regenerator-runtime/runtime.js";

import ReactDOM from "react-dom";
import "../assets/application.scss";
import { io } from "socket.io-client";
import init from "./init.jsx";

const app = async () => {
  const root = document.getElementById("chat");
  const socket = io();
  const vdom = await init(socket);
  ReactDOM.render(vdom, root);
};

app();
