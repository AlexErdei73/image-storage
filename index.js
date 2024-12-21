import { initLogin } from "./components/login.js";
import { showMainElement } from "./components/navigationBar.js";
import { initRegister } from "./components/register.js";

export const appData = {};

initRegister();
initLogin();
showMainElement();
