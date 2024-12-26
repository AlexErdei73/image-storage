import { upload } from "../backend/backend.js";
import { importTemp } from "../helper.js";
import { getUser, appData } from "../index.js";
import { showError, removeError } from "./register.js";

let userLoggedIn;
const WELCOME_TEXT_NO_USER = `Please login or
register if you do not have an account yet`;

async function submit(event) {
	event.preventDefault();
	const form = event.target;
	const submitBtn = form.querySelector("button[type = 'submit']");
	submitBtn.setAttribute("disabled", "");
	const json = await upload(form.file.files[0], userLoggedIn.token);
	removeError(form);
	if (json.error) {
		console.error(json.error);
		showError(form, json.error);
	} else {
		submitBtn.removeAttribute("disabled");
		console.log(json);
	}
}

function onClickFolder(event) {
	const folderBtn = event.currentTarget;
	const isOpen = folderBtn.getAttribute("data-open") === "true" ? true : false;
	const icon = folderBtn.querySelector("ion-icon");
	if (isOpen) {
		folderBtn.setAttribute("data-open", "false");
		icon.setAttribute("name", "folder-outline");
	} else {
		folderBtn.setAttribute("data-open", "true");
		icon.setAttribute("name", "folder-open-outline");
	}
}

function getFoldersNode() {
	const node = importTemp(8);
	appData.storage.forEach((folder) => {
		const item = importTemp(9);
		const button = item.querySelector("ion-button");
		button.setAttribute("data-folder", folder);
		button.addEventListener("click", onClickFolder);
		const span = item.querySelector("span");
		span.textContent = folder;
		node.appendChild(item);
	});
	return node;
}

export function initHome() {
	const homeNode = document.querySelector(".home article");
	const oldFormNode = homeNode.childNodes[0];
	const node = importTemp(7);
	const pNode = node.querySelector("p");
	let text = WELCOME_TEXT_NO_USER;
	userLoggedIn = getUser();
	if (userLoggedIn.token !== "") text = `Welcome ${userLoggedIn.username}!`;
	pNode.textContent = text;
	node.addEventListener("submit", submit);
	if (!oldFormNode) homeNode.appendChild(node);
	else homeNode.replaceChild(node, oldFormNode);
	const oldFoldersNode = homeNode.childNodes[1];
	const folders = getFoldersNode();
	if (!oldFoldersNode) homeNode.appendChild(folders);
	else homeNode.replaceChild(folders, oldFoldersNode);
}
