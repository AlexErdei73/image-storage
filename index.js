import { initHome } from "./components/home.js";
import { initLogin } from "./components/login.js";
import { showMainElement } from "./components/navigationBar.js";
import { initRegister } from "./components/register.js";

export const appData = {
	user: {
		username: "",
		token: "",
	},
};

export function getUser() {
	return { ...appData.user };
}

export function setUser(user) {
	appData.user = { ...user };
}

const userLoggedIn = JSON.parse(localStorage.getItem("user"));
if (userLoggedIn) setUser(userLoggedIn);

initRegister();
initLogin();
initHome();
showMainElement();
