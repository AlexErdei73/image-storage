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

function showPreview(event) {
	const button = event.currentTarget;
	const folder = button.getAttribute("data-folder");
	const filename = button.getAttribute("data-file");
	const img = document.querySelector("figure img");
	img.setAttribute(
		"src",
		`https://alexerdei-team.us.ainiro.io/magic/modules/image-storage/image?folder=${folder}&filename=${filename}`
	);
}

function getFileListNode(folder) {
	const fileList = appData[folder];
	const node = importTemp(10);
	fileList.forEach((file) => {
		const item = importTemp(11);
		item.setAttribute("data-file", file);
		const span = item.querySelector("span");
		span.textContent = file;
		// add event listeners to the buttons here
		const button = item.querySelector("button");
		button.setAttribute("data-folder", folder);
		button.setAttribute("data-file", file);
		button.addEventListener("mouseover", showPreview);
		// end of listeners
		node.appendChild(item);
	});
	return node;
}

function onClickFolder(event) {
	const folderBtn = event.currentTarget;
	const isOpen = folderBtn.getAttribute("data-open") === "true" ? true : false;
	const folder = folderBtn.getAttribute("data-folder");
	const icon = folderBtn.querySelector("ion-icon");
	const parentNode = document.querySelector(`li[data-folder="${folder}"]`);
	if (isOpen) {
		folderBtn.setAttribute("data-open", "false");
		icon.setAttribute("name", "folder-outline");
		const fileListNode = parentNode.querySelector("ul");
		parentNode.removeChild(fileListNode);
	} else {
		folderBtn.setAttribute("data-open", "true");
		icon.setAttribute("name", "folder-open-outline");
		parentNode.appendChild(getFileListNode(folder));
	}
}

function getFoldersNode() {
	const node = importTemp(8);
	appData.storage.forEach((folder) => {
		const item = importTemp(9);
		item.setAttribute("data-folder", folder);
		const button = item.querySelector("ion-button");
		button.setAttribute("data-folder", folder);
		button.addEventListener("click", onClickFolder);
		const span = item.querySelector("span");
		span.textContent = folder;
		node.appendChild(item);
	});
	if (appData.storage.error) {
		removeError(node);
		showError(node, appData.storage.error);
	}
	return node;
}

export function initHome() {
	const homeNode = document.querySelector(".home article");
	const oldFormNode = homeNode.childNodes[0];
	const node = importTemp(7);
	const pNode = node.querySelector("p");
	let text = WELCOME_TEXT_NO_USER;
	userLoggedIn = getUser();
	if (userLoggedIn && userLoggedIn.token !== "") {
		text = `Welcome ${userLoggedIn.username}!`;
		const homeArticle = document.querySelector(".home article");
		homeArticle.classList.remove("center");
	}
	pNode.textContent = text;
	node.addEventListener("submit", submit);
	if (!oldFormNode) homeNode.appendChild(node);
	else homeNode.replaceChild(node, oldFormNode);
	if (userLoggedIn && userLoggedIn.token !== "") {
		const oldFoldersNode = homeNode.childNodes[1];
		const folders = getFoldersNode();
		if (!oldFoldersNode) homeNode.appendChild(folders);
		else homeNode.replaceChild(folders, oldFoldersNode);
	}
}
