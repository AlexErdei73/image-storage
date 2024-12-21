import { importTemp } from "../helper.js";
import { register } from "../backend/backend.js";

export function removeError(node) {
  const errorNode = node.querySelector(".error");
  if (errorNode) node.removeChild(errorNode);
}

export function showError(node, error) {
  const errorNode = importTemp(5);
  errorNode.textContent = error.message;
  node.appendChild(errorNode);
}

function addSubmitListener(node) {
    const listener = async function (event) {
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
        removeError(node);
        const json = await register(user);
        if (json.error) {
          console.error(json.error);
          showError(node, json.error);
        } else console.log(json);
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