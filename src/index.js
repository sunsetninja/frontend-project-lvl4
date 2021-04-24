import "core-js/stable/index.js";
import "regenerator-runtime/runtime.js";
import ReactDOM from "react-dom";
import "../assets/application.scss";
import init from "./init.js";

const app = async () => {
  const root = document.getElementById("chat");
  const vdom = await init();
  ReactDOM.render(vdom, root);
};

app();
