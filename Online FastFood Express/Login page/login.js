document.getElementById("loginForm")
.addEventListener("submit", async function(e) {

    e.preventDefault();

    const loginInput = document.getElementById("loginInput").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (loginInput === "" || password.trim() === "") {

        message.textContent = "Please fill all fields!";
        return;

    }

});
