const gameBtn = document.getElementById("gameBtn");
const points = document.getElementsByClassName("point");

gameBtn.addEventListener("click", startOrStopGame);


document.querySelector("#loginWrapper form").addEventListener("submit", (event) => {
    event.preventDefault();
    auth();
});


[...points].forEach((elem) => {
    elem.addEventListener("click", addPoint);
});

let USERNAME;
let selectedPoint = null; 

function addPoint(event) {
    let target = event.target;

    
    const activeBtn = document.querySelector(".point.active");
    if (activeBtn) {
        activeBtn.classList.remove("active");
    }

   
    target.classList.add("active");

   
    selectedPoint = +target.innerHTML;
}


function activeArea() {
    const field = document.getElementsByClassName("field");

  
    for (let i = 0; i < field.length; i++) {
        field[i],addEventListener("contextmenu", setFlag)
        setTimeout(() => {
            field[i].classList.add("active");
        }, 20 * i); 
    }
}
function setFlag(){
    let target = event.target;
    target.classList.add("flag");
}

function startOrStopGame() {
    if (gameBtn.innerHTML === "ИГРАТЬ") {
        gameBtn.innerHTML = "ЗАВЕРШИТЬ ИГРУ";
        gameBtn.style.backgroundColor = "red";
        startGame();
    } else {
        gameBtn.innerHTML = "ИГРАТЬ";
        gameBtn.style.backgroundColor = "#66a663";
        stopGame();
    }
}

async function startGame() {
    if (selectedPoint === null) {
        alert("Выберите точку!");
        return;
    }

    const response = await sendRequest("new_game", "POST", {
        username: USERNAME,
        points: selectedPoint,
    });

    if (response.error) {
        gameBtn.innerHTML = "ИГРАТЬ";
        alert(response.message);
    } else {
        game_id = response.game_id;
        updateUserBalance();
        activeArea();
    }
}

async function stopGame() {
    const response = await sendRequest("stop_game", "POST", {
        username: USERNAME,
        game_id,
    });

    if (response.error) {
        gameBtn.innerHTML = "ЗАВЕРШИТЬ ИГРУ";
        alert(response.message);
    } else {
        updateUserBalance();
        resetField();
    }
}

function resetField() {
    const gameField = document.querySelector(".gameField");
    gameField.innerHTML = "";
    for (let i = 0; i < 80; i++) {
        let cell = document.createElement("div");
        cell.classList.add("field");
        gameField.appendChild(cell);
    }
}

async function auth() {
    const loginWrapper = document.getElementById("loginWrapper");
    const login = document.getElementById("login").value;

    let response = await sendRequest("user", "GET", {
        username: login
    });

    if (response.error) {
        let registration = await sendRequest("user", "POST", { username: login });
        if (registration.error) {
            alert(registration.message);
        } else {
            USERNAME = login;
            loginWrapper.style.display = "none";
            updateUserBalance();
        }
    } else {
        USERNAME = login;
        loginWrapper.style.display = "none";
        updateUserBalance();
    }
}

async function updateUserBalance() {
    let response = await sendRequest("user", "GET", {
        username: USERNAME
    });

    if (response.error) {
        alert(response.message);
    } else {
        const user = document.querySelector("header span");
        user.innerHTML = `Пользователь ${response.username} с балансом ${response.balance}`;
    }
}


async function sendRequest(url, method, data) {
    const baseUrl = "https://tg-api.tehnikum.school/tehnikum_course/minesweeper/";
    url = baseUrl + url;

    if (method === "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } else if (method === "GET") {
        url = url + "?" + new URLSearchParams(data).toString();
        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    }
}


updateUserBalance();
