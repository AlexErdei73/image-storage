const BASE_URL = "https://alexerdei-team.us.ainiro.io/magic/modules/image-storage/";

export async function register(user) {
    const response = await fetch(`${BASE_URL}register`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    })
    return await response.json();
}