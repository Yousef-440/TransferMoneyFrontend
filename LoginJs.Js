import Swal from "sweetalert2";

const loginForm = document.getElementById('LoginForm');

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const obj = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById('password').value
    };

    const url = "http://localhost:8082/api/v1/user/login";
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(resError => {
                    throw resError
                })
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                html: `
            <p style="font-size: 1.1rem; color: #4CAF50;">${data.data.message}</p>
        `,
                confirmButtonText: 'OK',
                timer: 3500,
                timerProgressBar: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.replace("HomePage.html");
                }
            });

            window.localStorage.setItem("JWT-Token", data.data.token);
            window.localStorage.setItem('name', data.data.firstName);
            window.localStorage.setItem('balance', data.data.balance);

            setTimeout(() => {
                window.location.replace("HomePage.html");
            }, 3500);
        })

        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error Occurred',
                html: `
                    <div style="
                        font-size: 1rem; 
                        color: #8B0000; 
                        background: #ffe6e6; 
                        padding: 15px; 
                        border-radius: 8px;
                    ">
                        ${err.message || "Unexpected error occurred"}
                    </div>
                `
            });
        });
});
