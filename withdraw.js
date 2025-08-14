import Swal from "sweetalert2";

let withForm = document.getElementById('withdrawForm');

withForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const obj = {
        accountNumber: document.getElementById('accountNumber').value,
        amount: document.getElementById('moneyWithdraw').value,
        description: document.getElementById('message').value
    };

    const url = 'http://localhost:8082/api/v1/transaction/withdraw';
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + localStorage.getItem('JWT-Token')
        },
        body: JSON.stringify(obj)
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((data) => {
                throw data;
            })
        }
        return response.json();
    }).then(data => {
        Swal.fire({
            icon: 'success',
            title: `${data.message}`,
            html: `<p style="font-size: 1.1rem; color: #4CAF50;">${data.data.message}</p>`,
            confirmButtonText: 'OK',
            timer: 3500,
            timerProgressBar: true
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.replace("HomePage.html");
            }
        });
        setTimeout(() => {
            window.location.replace("HomePage.html");
        }, 3500);
    }).catch((error) => {
        if (error.errors) {
            console.log(error.errors);
            const val = Object.values(error.errors);
            console.log("#".repeat(64))
            console.log(val[0]);
            Swal.fire({
                icon: 'error',
                title: `${val}`
            })
        } else if (error.message) {
            Swal.fire({
                icon: 'error',
                title: "Incorrect operation",
                html: `<p style="font-size: 1.1rem; color: red">${error.message}</p>`
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: "Incorrect operation",
                html: `<p style="font-size: 1.1rem; color: red">Something Went Error</p>`
            })
        }
    })
})