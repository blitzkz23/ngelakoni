const API_HOST = "http://127.0.0.1:5000/api";
const registerForm = document.getElementById("form-register");

window.onload = function () {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Init AJAX
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/auth/register";

    // Get value from form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    const toastLive = document.getElementById("live-toast");
    const toastMsg = document.getElementById("toast-body");
    toastMsg.innerHTML = "Semua field tidak boleh kosong";
    const toast = new bootstrap.Toast(toastLive);

    // Validation 1
    if (!name | !email | !password | !confirmPassword) return toast.show();

    // Validation 2
    if (password != confirmPassword) {
      toastMsg.innerHTML = "Password harus sama dengan konfirmasi password";
      return toast.show();
    }

    // JSON payload
    const data = JSON.stringify({
      username: name,
      email: email,
      password: password,
    });

    // Call Register Endpoint
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.onreadystatechange = function () {
      if (this.status == 200) {
        const toastLiveSuccess = document.getElementById("live-toast-success");
        const toastMsgSuccess = document.getElementById("toast-body-success");
        toastMsgSuccess.innerHTML =
          "Akun Anda telah berhasil teregistrasi! Anda akan segera dialihkan kembali ke halaman login";
        const toastSuccess = new bootstrap.Toast(toastLiveSuccess);
        toastSuccess.show();

        registerForm.reset();
        var delayInMilliseconds = 3000;
        setTimeout(function () {
          //your code to be executed after 2 second
          window.location.href = "http://127.0.0.1:5000/auth/login";
        }, delayInMilliseconds);
      } else {
        toastMsg.innerHTML = this.response;
        toast.show();
      }
    };

    xhr.send(data);
  });
};
