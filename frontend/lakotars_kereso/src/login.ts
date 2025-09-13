import { getProfile } from "./main";

async function LoginForm_Click(e: any) {
    e.preventDefault();
    const loginUsername = (document.getElementById("loginUsername") as HTMLInputElement);
    const loginPassword = (document.getElementById("loginPassword") as HTMLInputElement);

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: loginUsername.value,
            password: loginPassword.value
        })
    });

    const data = await res.json();
    const result = document.getElementById("loginResult") as HTMLParagraphElement;
    result.textContent = data.message;
    const token = data.token;

    if (token) {
        localStorage.setItem("token", data.token);
        window.location.href = "main.html";
    } else {
        alert("Hibás felhasználónév vagy jelszó!");
    }

    getProfile();
};

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", LoginForm_Click);
    }
});