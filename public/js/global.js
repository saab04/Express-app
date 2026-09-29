const logOutButtons = document.querySelectorAll(".logout");
logOutButtons.forEach(e => {
    e.addEventListener("click", async e => {
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
});

const nameDisplays = document.querySelectorAll(".name-display");

async function checkUserSession() {
    try {
        const response = await fetch("/auth/user", {
            method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        if(data.loggedIn) {
            console.log("Logged in as:", data.username);

            nameDisplays.forEach(e => {
                const nameText = document.createElement("p");
                nameText.textContent = data.username;
                e.prepend(nameText);
            })

        }

    } catch (error) {
        console.error("Error:", error);

    }
}

checkUserSession();

async function getRewardInfo() {
    try {
        const response = await fetch("/dashboard/reward-info", {
            method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;

    } catch (error) {
        console.error("Error:", error);
    }
}

const currentUrl = window.location.pathname;
const navLinks = document.querySelectorAll("a");

navLinks.forEach(link => {
    link.style.textDecoration = (link.getAttribute("href") === currentUrl) ? "underline" : "";
});

lucide.createIcons();