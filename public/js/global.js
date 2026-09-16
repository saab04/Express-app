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

const balance = document.getElementById("balance");
const contentDivs = document.querySelectorAll("#balance-display > div");
const timerText = document.getElementById("cooldown-timer");
const rewardButton = document.getElementById("reward-btn");
let timerInterval = null;

async function initRewardSystem() {
    const data = await getRewardInfo();

    if (data) {
        balance.textContent = `${data.coins}`;

        const now = new Date().getTime();
        const targetTime = new Date(data.nextRewardTime).getTime();
        
        if (data.nextRewardTime && targetTime > now) {
            if (!contentDivs[1].querySelector(".countdown-text")) {
                const countdownText = document.createElement("p");
                countdownText.classList.add("countdown-text");
                countdownText.textContent = "Time until next award:";
                contentDivs[1].prepend(countdownText);
            }
        }

        startCountdown(data.nextRewardTime);
    } else {
        startCountdown(null);
    }

    document.getElementById("balance-display").classList.remove("opacity-0");
}

function startCountdown(targetTimeISO) {
    if (timerInterval) clearInterval(timerInterval);

    if (!targetTimeISO) {
        enableRewardButton();
        return;
    }

    const targetTime = new Date(targetTimeISO).getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = targetTime - now;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            enableRewardButton();
            return;
        }

        rewardButton.disabled = true;
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        timerText.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function enableRewardButton() {
    rewardButton.disabled = false;

    const existingText = contentDivs[1].querySelector(".countdown-text");
    if (existingText) {
        existingText.remove();
    }
}

rewardButton.addEventListener("click", async e => {
    e.preventDefault();

    try {
        rewardButton.disabled = true;
       
        const response = await fetch("/dashboard/claim-reward", { method: "POST" });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        balance.textContent = `${data.coins}`;

        if (!contentDivs[1].querySelector(".countdown-text")) {
            const countdownText = document.createElement("p");
            countdownText.classList.add("countdown-text"); // Viktigt för att matcha vid refresh!
            countdownText.textContent = "Time until next award:";
            contentDivs[1].prepend(countdownText);
        }

        startCountdown(data.nextRewardTime);


    } catch (error) {
        console.error("Error:", error);
        rewardButton.disabled = false;
    }

});

initRewardSystem();

lucide.createIcons();