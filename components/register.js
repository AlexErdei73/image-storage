import { importTemp } from "../helper.js";
import { register } from "../backend/backend.js";

function addSubmitListener(node) {
    const listener = function (event) {
        event.preventDefault();
        const username = node.querySelector("#username").value;
        const password = node.querySelector("#password").value;
        const email = node.querySelector("#email").value;
        const name = node.querySelector("#name").value;
        const user = {
          username,
          password,
          email,
          name,
        };
        register(user);
    };
    
    node.addEventListener("submit", listener);
}

export function initRegister() {
  const registerNode = document.querySelector(".register article");
  const oldNode = registerNode.childNodes[0];
  const node = importTemp(4);
  addSubmitListener(node);
  if (!oldNode) registerNode.appendChild(node);
  else registerNode.replaceChild(node, oldNode);
}