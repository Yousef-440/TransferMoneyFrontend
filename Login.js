document.getElementById('signupForm').addEventListener("submit", (event) => {
    event.preventDefault();

    const obj = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        gender: document.getElementById("gender").value,
        address: document.getElementById("address").value,
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        password: document.getElementById("pass").value
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
            console.log("Success:", data);
            alert("Registration successful! Welcome " + data.data.fullName);
        })
        .catch(error => {
            alert("Error: " + (error.message || "حدث خطأ أثناء التسجيل"));
        });

});
