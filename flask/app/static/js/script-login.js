const API_HOST = "http://127.0.0.1:5000/api";
const loginForm = document.getElementById("form-login");

window.onload = function () {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Initiate AJAX
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/auth/login";

    // Get value from form
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const toastLive = document.getElementById("live-toast");
    const toastMsg = document.getElementById("toast-body");
    toastMsg.innerHTML = "Email/password tidak boleh kosong";
    const toast = new bootstrap.Toast(toastLive);

    // Validation
    if (!email | !password) return toast.show();

    // JSON payload
    const data = JSON.stringify({
      email: email,
      password: password,
    });

    // Call Login Endpoint
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.response); 

        localStorage.setItem("access_token", response.access_token);
        window.location.href = "http://127.0.0.1:5000/";
      } else {
        const response = JSON.parse(this.response);
        var message = response.message;
        toastMsg.innerHTML = message;
        toast.show();
      }
    };

    xhr.send(data);
  });
};
