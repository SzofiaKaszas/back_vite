async function RegisterForm_Click(e: any) {
  e.preventDefault();

  const result = document.getElementById("registerResult") as HTMLParagraphElement;

  const loginUsername = (document.getElementById("registerUsername") as HTMLInputElement);
  const loginPassword = (document.getElementById("registerPassword") as HTMLInputElement);

  if (loginPassword.value.length < 6) {
    result.textContent = "A jelszónak legalább 6 karakter hosszúnak kell lennie.";
    return;
  }

  let hasNumber = false;
  for (let i = 0; i < loginPassword.value.length; i++) {
    if (!isNaN(Number(loginPassword.value[i])) && loginPassword.value[i] !== " ") {
      hasNumber = true;
      break;
    }
  }

  if (!hasNumber) {
    result.textContent = "A jelszónak számot is kell tartalmaznia.";
    return;
  }

  const res = await fetch("http://localhost:3000/register", {
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
  result.textContent = data.message;
};

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", RegisterForm_Click);
  }
});
