import { importTemp } from "../helper.js";
import { getUser } from "../index.js";

let userLoggedIn;
const WELCOME_TEXT_NO_USER = `Please login or
register if you do not have an account yet`;

export function initHome() {
	const homeNode = document.querySelector(".home article");
	const oldNode = homeNode.childNodes[0];
	const node = importTemp(7);
	const pNode = node.querySelector("p");
	let text = WELCOME_TEXT_NO_USER;
	userLoggedIn = getUser();
	if (userLoggedIn.token !== "") text = `Welcome ${userLoggedIn.username}!`;
	pNode.textContent = text;
	if (!oldNode) homeNode.appendChild(node);
	else homeNode.replaceChild(node, oldNode);
}
