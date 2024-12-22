import { importTemp } from "../helper.js";
import { login } from "../backend/backend.js";
import { removeError, showError } from "./register.js";
import { setUser } from "../index.js";
import { initHome } from "./home.js";

const userLoggedIn = {
	username: "",
	token: "",
};

function addSubmitListener(node) {
	const listener = async function (event) {
		event.preventDefault();
		const username = node.querySelector("#username").value;
		const password = node.querySelector("#password").value;
		const user = {
			username,
			password,
		};
		removeError(node);
		const json = await login(user);
		if (json.error) {
			console.error(json.error);
			showError(node, json.error);
		} else {
			userLoggedIn.username = user.username;
			userLoggedIn.token = `Bearer ${json.token}`;
			localStorage.setItem(user, JSON.stringify(userLoggedIn));
			setUser(userLoggedIn);
			initHome();
		}
	};

	node.addEventListener("submit", listener);
}

export function initLogin() {
	const loginNode = document.querySelector(".login article");
	const oldNode = loginNode.childNodes[0];
	const node = importTemp(6);
	addSubmitListener(node);
	if (!oldNode) loginNode.appendChild(node);
	else loginNode.replaceChild(node, oldNode);
}
