import Swal from "sweetalert2";


const depoForm = document.getElementById('deposit-form');

depoForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const obj = {
        accountNumber: document.getElementById('account').value.trim(),
        amount: parseFloat(document.getElementById('amount').value)
    };
    if (obj.amount <= 0) {
        alert("Please enter a valid account number and amount.");
        return;
    }

    const url = "http://localhost:8082/api/v1/transaction/deposit";

    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('JWT-Token')
        },
        body: JSON.stringify(obj)
    })
        .then(response => response.json())
        .then(data => {
            depoForm.reset();
            Swal.fire({
                icon: 'success',
                title: 'Money has been deposited successfully!',
                html: `
                        <p style="font-size: 1.1rem; color: #4CAF50;">${data.data.status}</p>
                    `,
                confirmButtonText: 'OK',
                timer: 3500,
                timerProgressBar: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.replace("HomePage.html");
                }
            });
            setTimeout(() => {
                window.location.replace("HomePage.html")
            }, 3500)
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
});
