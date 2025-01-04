import { deleteFile, downloadFile, upload } from "../backend/backend.js";
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
		const index = appData.storage.indexOf(userLoggedIn.username);
		if (index === -1) {
			appData.storage.push(userLoggedIn.username);
			appData[userLoggedIn.username] = [];
		}
		const newName = form.file.files[0].name.split(".");
		newName[1] = "webp";
		appData[userLoggedIn.username].push(newName.join("."));
		initHome();
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

function showImageInModal(event) {
	const button = event.currentTarget;
	const folder = button.getAttribute("data-folder");
	const filename = button.getAttribute("data-file");
	const dialog = document.querySelector("dialog");
	const img = document.querySelector("dialog img");
	img.setAttribute(
		"src",
		`https://alexerdei-team.us.ainiro.io/magic/modules/image-storage/image?folder=${folder}&filename=${filename}`
	);
	dialog.showModal();
}

async function downloadImage(event) {
	const button = event.currentTarget;
	const folder = button.getAttribute("data-folder");
	const filename = button.getAttribute("data-file");
	const blob = await downloadFile(folder, filename, getUser().token);
	if (blob.error) {
		const node = document.querySelector("ul.folders");
		removeError(node);
		showError(node, blob.error);
	} else {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		const clickHandler = () => {
			setTimeout(() => {
				URL.revokeObjectURL(url);
				removeEventListener("click", clickHandler);
			}, 150);
		};
		a.addEventListener("click", clickHandler, false);
		a.click();
		return a;
	}
}

async function removeFile(event) {
	const button = event.currentTarget;
	const folder = button.getAttribute("data-folder");
	const filename = button.getAttribute("data-file");
	const json = await deleteFile(folder, filename, getUser().token);
	const folders = document.querySelector("ul.folders");
	removeError(folders);
	if (json.error) {
		console.error(json.error);
		showError(folders, json.error);
	} else {
		const index = appData[folder].indexOf(filename);
		appData[folder].splice(index, 1);
		const folderNode = folders.querySelector(`li[data-folder="${folder}"]`);
		const fileNode = folderNode.querySelector(`li[data-file="${filename}"]`);
		fileNode.remove();
	}
}

function insertFileNode(folder, file, node) {
	const item = importTemp(11);
	item.setAttribute("data-file", file);
	const span = item.querySelector("span");
	span.textContent = file;
	// add event listeners to the buttons here
	const button = item.querySelector("button");
	button.setAttribute("data-folder", folder);
	button.setAttribute("data-file", file);
	button.addEventListener("mouseover", showPreview);
	button.addEventListener("click", showImageInModal);
	const closeDlgBtn = document.querySelector("dialog ion-button");
	closeDlgBtn.addEventListener("click", () => {
		const dialog = document.querySelector("dialog");
		dialog.close();
	});
	const downloadBtn = item.querySelector("ion-button.download");
	downloadBtn.setAttribute("data-folder", folder);
	downloadBtn.setAttribute("data-file", file);
	downloadBtn.addEventListener("click", downloadImage);
	const deleteBtn = item.querySelector("ion-button.delete");
	if (getUser().username !== folder) {
		deleteBtn.classList.add("hidden");
	} else {
		deleteBtn.classList.remove("hidden");
		deleteBtn.setAttribute("data-folder", folder);
		deleteBtn.setAttribute("data-file", file);
		deleteBtn.addEventListener("click", removeFile);
	}
	// end of listeners
	node.appendChild(item);
}

function getFileListNode(folder) {
	const fileList = appData[folder];
	const node = importTemp(10);
	fileList.forEach((file) => insertFileNode(folder, file, node));
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

function logout() {
	localStorage.removeItem("user");
	appData.user = {
		username: "",
		token: "",
	};
	appData.storage = [];
	userLoggedIn = getUser();
	initHome();
}

export function initHome() {
	const homeNode = document.querySelector(".home");
	const oldFormNode = homeNode.childNodes[0];
	const node = importTemp(7);
	const pNode = node.querySelector("p");
	let text = WELCOME_TEXT_NO_USER;
	userLoggedIn = getUser();
	const logoutBtn = node.querySelector("button.logout");
	logoutBtn.classList.add("hidden");
	if (userLoggedIn && userLoggedIn.token !== "") {
		text = `Welcome ${userLoggedIn.username}!`;
		homeNode.classList.remove("center");
		logoutBtn.classList.remove("hidden");
		logoutBtn.addEventListener("click", logout);
	}
	pNode.textContent = text;
	node.addEventListener("submit", submit);
	if (!oldFormNode) homeNode.appendChild(node);
	else homeNode.replaceChild(node, oldFormNode);
	const oldFoldersNode = homeNode.childNodes[1];
	if (userLoggedIn && userLoggedIn.token !== "") {
		const folders = getFoldersNode();
		if (!oldFoldersNode) homeNode.appendChild(folders);
		else homeNode.replaceChild(folders, oldFoldersNode);
	} else {
		if (oldFoldersNode) oldFoldersNode.remove();
		homeNode.classList.add("center");
	}
}
