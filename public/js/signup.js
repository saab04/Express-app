const API_URL = "http://localhost:3000";

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const signUpButton = document.querySelector("#sign-up-form > button");

signUpButton.addEventListener("click", async e => {
    e.preventDefault();

    const username = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmedPassword = confirmPasswordInput.value.trim();

    if(!username || !email || !password || !confirmedPassword) {
        console.log("Empty input fields");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, email: email, password: password, confirmedPassword: confirmedPassword})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration of user failed");
        }

        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        confirmedPassword.value = "";
        
        console.log("User signed up:", data);
        window.location.href = "/dashboard"; 

    } catch (error) {
        console.error("Error:", error.message)
    }
})