import Swal from "sweetalert2";

const nameUser = window.localStorage.getItem('name');
const token = localStorage.getItem("JWT-Token");
let balance = localStorage.getItem('balance');
const accountNumber = localStorage.getItem('accountNumber');


let nameElement = document.getElementById('name');
nameElement.textContent = nameUser;

let balan = document.querySelector('.box-value');
balan.textContent = balance + " $";


// => Check the JWT
function checkToken() {
    if (token) {
        const decoded = jwt_decode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
            localStorage.removeItem("JWT-Token");
            window.location.replace('login.html');
        }
    } else {
        window.location.replace('login.html');
    }
}
checkToken();
// Check The JWT <=


// => Time
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
// Time <=



// => Get Amount of Balance
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
    .catch(err =>
        balan.innerHTML = `
            <li class="error-message" style="text-align: center; padding: 2rem; color: #e53e3e;">
                Failed to load balance..
            </li>
        `
    );
// Get Amount of Balance <=



// => Transaction Data
const urlTransaction = `http://localhost:8082/api/v1/transaction/transactionsSend?accountNumber=${accountNumber}`;
const tranLists = document.getElementById("transactionList");

fetch(urlTransaction, {
    method: "GET",
    headers: { 'Authorization': 'Bearer ' + token }
})
    .then(data => {
        if (!data.ok) {
            return data.json().then(errorRes => { throw errorRes });
        }
        return data.json();
    })
    .then(data => {
        tranLists.innerHTML = '';

        const arr = data.data;
        console.log(Array.isArray(arr));

        arr.forEach((element, index) => {
            const amountClass = element.transactionType === 'DEPOSIT' ? 'positive' : "negative";
            const transactionClass = element.transactionType.toLowerCase();
            const date = new Date(element.transactionDate).toLocaleString();

            let iconClass, iconSymbol;
            switch (element.transactionType) {
                case 'DEPOSIT':
                    iconClass = 'deposit-icon';
                    iconSymbol = '↓';
                    break;
                case 'WITHDRAW':
                    iconClass = 'withdraw-icon';
                    iconSymbol = '↑';
                    break;
                case 'TRANSFER':
                    iconClass = 'transfer-icon';
                    iconSymbol = '→';
                    break;
                default:
                    iconClass = 'deposit-icon';
                    iconSymbol = '•';
            }

            const li = document.createElement('li');
            li.className = `transaction-item ${transactionClass} animate-in`;
            li.style.animationDelay = `${index * 0.1}s`;
            li.innerHTML = `
                <div class="transaction-icon ${iconClass}">${iconSymbol}</div>
                <div class="transaction-details">
                    <div class="transaction-title">${element.transactionType}</div>
                    <div class="transaction-date">${date}</div>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${element.transactionType === 'DEPOSIT' ? "+" : "-"} ${element.amount.toLocaleString()}
                </div>
            `;
            tranLists.appendChild(li);
        });
    })
    .catch(error => {
        console.error("Error fetching transactions:", error);
        tranLists.innerHTML = `
            <li class="error-message" style="text-align: center; padding: 2rem; color: #e53e3e;">
                Failed to load transactions. Please try again later.
            </li>
        `;
    });

//Transaction Data <=


// => Toggle Button View
let btnView = document.getElementById("view");
btnView.addEventListener('click', function () {
    const container = document.querySelector('.transactions-container');

    if (container.style.display === 'none') {
        container.style.display = 'block';
        btnView.textContent = 'Hide';
        container.style.animation = 'fadeIn 0.5s ease';
    } else {
        container.style.display = 'none';
        btnView.textContent = 'Show';
    }
});
//Toggle Button View// <=


// => Log Out 
let btn = document.getElementById("logoutBtn");
btn.addEventListener('click', () => {
    Swal.fire({
        title: 'Log out',
        text: "Are you sure you want to log out?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Log out',
        cancelButtonText: 'No',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        backdrop: `
            rgba(52, 73, 94, 0.58)

        `,
        background: '#1a1a2e',
        color: '#ffffff',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Log out well done',
                text: `See you later ${localStorage.getItem('name')} !`,
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                background: '#1a1a2e',
                color: '#ffffff'
            }).then(() => {
                localStorage.removeItem('JWT-Token');
                window.location.replace("login.html");
            });
        }
    });
});
//Log Out <=