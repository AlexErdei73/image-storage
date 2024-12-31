const BASE_URL =
	"https://alexerdei-team.us.ainiro.io/magic/modules/image-storage/";

async function getJSON(response) {
	const json = await response.json();
	if (response.status > 299) throw Error(json.message);
	return json;
}

async function getBlob(response) {
	if (response.status > 299) {
		const json = await response.json();
		throw Error(json.message);
	}
	return await response.blob();
}

export async function register(user) {
	try {
		const response = await fetch(`${BASE_URL}register`, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
		return await getJSON(response);
	} catch (error) {
		return { error };
	}
}

export async function login(user) {
	const { username, password } = user;
	try {
		const response = await fetch(
			`${BASE_URL}login?username=${username}&password=${password}`,
			{
				method: "GET",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return await getJSON(response);
	} catch (error) {
		return { error };
	}
}

export async function upload(file, token) {
	const formData = new FormData();
	formData.append("file", file);
	try {
		const response = await fetch(`${BASE_URL}image`, {
			method: "POST",
			mode: "cors",
			headers: {
				Authorization: token,
			},
			body: formData,
		});
		return await getJSON(response);
	} catch (error) {
		return { error };
	}
}

export async function getStorage(token) {
	try {
		const response = await fetch(`${BASE_URL}storage`, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: token,
			},
		});
		return await getJSON(response);
	} catch (error) {
		return { error };
	}
}

export async function downloadFile(folder, filename, token) {
	try {
		const response = await fetch(`${BASE_URL}image?folder=${folder}&filename=${filename}`, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: token,
			},
		});
		return await getBlob(response);
	} catch(error) {
		return { error };
	}
}

export async function deleteFile(folder, filename, token) {
	try {
		const response = await fetch(`${BASE_URL}image?folder=${folder}&filename=${filename}`, {
			method: "DELETE",
			mode: "cors",
			headers: {
				Authorization: token,
			}
		});
		return await getJSON(response);
	} catch(error) {
		return { error };
	}
}