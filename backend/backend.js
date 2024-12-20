const BASE_URL = "https://alexerdei-team.us.ainiro.io/magic/modules/image-storage/";

async function getJSON(response) {
    const json = await response.json();
    if (json.message !== "OK") throw Error(json.message);
    return json
}

export async function register(user) {
    try {
        const response = await fetch(`${BASE_URL}register`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })
        return await getJSON(response);
    } catch(error) {
        return { error }
    }
}