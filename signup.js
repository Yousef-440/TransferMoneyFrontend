import Swal from 'sweetalert2';

const signupForm = document.getElementById('signupForm');
const submitBtn = signupForm.querySelector('button[type="submit"]');

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    submitBtn.disabled = true;

    const obj = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        gender: document.getElementById("gender").value,
        address: document.getElementById("address").value.trim(),
        email: document.getElementById("email").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
        password: document.getElementById("pass").value.trim()
    };

    const url = "http://localhost:8082/api/v1/user/register";
    console.log("fetch Started")
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw errorData;
                });
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                html: `<p style="font-size: 1.1rem; color: #4CAF50;">${data.data.message}</p>`,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                timer: 3500,
                timerProgressBar: true,
            });
        })
        .catch(error => {
            console.log(error);
            if (error.errors) {
                const allErrors = Object.values(error.errors)
                    .flat()
                    .join('<br>');

                Swal.fire({
                    icon: 'error',
                    title: '<strong style="font-family: Arial, sans-serif; font-weight: 700; color: #d33;">Error Occurred</strong>',
                    html: `
                    <div style="
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        font-size: 1rem; 
                        color: #8B0000; 
                        background: #ffe6e6; 
                        padding: 15px; 
                        border-radius: 8px; 
                        box-shadow: 0 0 10px rgba(211, 46, 70, 0.3);
                        text-align: left;
                        line-height: 1.5;
                    ">
                        ${allErrors}
                    </div>
                `,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timerProgressBar: false,
                    background: '#fff5f5',
                    backdrop: `
                    rgba(210, 40, 40, 0.25)
                    url("https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif")
                    center center
                    no-repeat
                `,
                    customClass: {
                        popup: 'swal2-shadow'
                    }
                });
            }
            else if (error.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                    confirmButtonText: 'OK',
                    timerProgressBar: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An unexpected error occurred',
                    confirmButtonText: 'OK',
                    timerProgressBar: false
                });
            }
        })
        .finally(() => {
            submitBtn.disabled = false;
        });
});
