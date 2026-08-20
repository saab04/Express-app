const nameInput = document.getElementById("name");
const passwordInput = document.getElementById("password");
const logInButton = document.querySelector("#login-form > button");

logInButton.addEventListener("click", async e => {
    e.preventDefault();

    const username = nameInput.value.trim();
    const password = passwordInput.value.trim();

    if(!username || !password) {
        console.log("Empty input field / fields");
        return;
    }

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login of user failed");
        }

        nameInput.value = "";
        passwordInput.value = "";
        
        console.log("User logged in:", data);
        window.location.replace("/dashboard");

    } catch (error) {
        console.error("Error:", error.message);
    }

});