function routeToLogin() {
  const token = localStorage.getItem("token");
  const button = document.getElementById("toLogin") as HTMLButtonElement;

  if (!token) {
    button.style.display = "auto";
    button.addEventListener("click", () => {
      window.location.href = "/login";
    });
  } else {
    button.style.display = "none";
  }
}

function routeToRegister() {
  const button = document.getElementById("toRegister") as HTMLButtonElement;

  button.addEventListener("click", () => {
    window.location.href = "/register";
  })
}

function logout() {
  const button = document.getElementById("logOut") as HTMLButtonElement;
  const token = localStorage.getItem("token");

  if (token) {
    button.style.display = "auto";
    button.addEventListener("click", () => {
      localStorage.removeItem("token");
    });
    window.location.reload();
  } else {
    button.style.display = "none";
  }
}

addEventListener("DOMContentLoaded", () => {
  routeToLogin();
  routeToRegister();
  logout();
});

/*setTimeout(() => {
    const token = localStorage.getItem("token");
    if (token) {
        localStorage.removeItem("token");
        alert("Biztonsági okokból automatikusan kijelentkeztél.");
        window.location.href = "login.html";
    }
}, 36);*/