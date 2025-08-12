const nameUser = window.localStorage.getItem('name');
const token = localStorage.getItem("JWT-Token");
let balance = localStorage.getItem('balance');

let nameElement = document.getElementById('name');
if (nameUser) {
    nameElement.textContent = nameUser;
}

let balan = document.querySelector('.box-value');
if (balan && balance) {
    balan.textContent = balance + " $";
}

checkToken();

function checkToken() {
    if (token) {
        const decoded = jwt_decode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
            localStorage.removeItem("JWT-Token");
            window.location.href = "login.html";
        }
    } else {
        window.location.href = "login.html";
    }
}

function updateClock() {
    const now = new Date();
    let hrs = Number(String(now.getHours()).padStart(2, "0")) % 12;
    let min = String(now.getMinutes()).padStart(2, "0");
    let sec = String(now.getSeconds()).padStart(2, "0");


    document.getElementById("hrs").textContent = hrs;
    document.getElementById("min").textContent = min;
    document.getElementById("sec").textContent = sec;
}

setInterval(updateClock, 1000);
updateClock();


const accountNumber = localStorage.getItem('accountNumber');
console.log(accountNumber);

fetch(`http://localhost:8082/api/v1/transaction/balance?account=${accountNumber}`, {
    method: "GET",
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('JWT-Token')
    }
})
    .then(res => res.json())
    .then(data =>
        balan.textContent = data.data + " $ "
    )
    .catch(err => console.error(err));
