const logOutButton = document.getElementById("logout");
logOutButton.addEventListener("click", async e => {
    e.preventDefault();

    try {
        const response = await fetch("/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log(data.message);
        window.location.replace("/auth/login");

    } catch (error) {
        console.error("Error:", error);
    }
});

const nameDisplay = document.getElementById("name-display");


async function checkUserSession() {
    try {
        const response = await fetch("/auth/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        if(data.loggedIn) {
            console.log("Logged in as:", data.username);

            const nameText = document.createElement("p");
            nameText.textContent = data.username;
            nameDisplay.prepend(nameText);

        }

    } catch (error) {
        console.log("Error:", error);

    }
}

checkUserSession();

lucide.createIcons();