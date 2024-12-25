import { getStorage } from "./backend/backend.js";
import { initHome } from "./components/home.js";
import { initLogin } from "./components/login.js";
import { showMainElement } from "./components/navigationBar.js";
import { initRegister } from "./components/register.js";

export const appData = {
	user: {
		username: "",
		token: "",
	},
	storage: [],
};

export function getUser() {
	return { ...appData.user };
}

export function setUser(user) {
	appData.user = { ...user };
}

export async function fetchStorage() {
	const storage = await getStorage(getUser().token);
	storage.forEach((folder) => {
		const folders = folder[0].split("/");
		const folderName = folders[folders.length - 2];
		appData.storage.push(folderName);
		appData[folderName] = [];
		folder.forEach((file) => {
			const path = file.split("/");
			const fileName = path[path.length - 1];
			appData[folderName].push(fileName);
		});
	});
}

const userLoggedIn = JSON.parse(localStorage.getItem("user"));
if (userLoggedIn) {
	setUser(userLoggedIn);
	await fetchStorage();
}

initRegister();
initLogin();
initHome();
showMainElement();
