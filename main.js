const gameBtn = document.getElementById("gameBtn");
// Слушатель события для кнопки
gameBtn.addEventListener("click", activeArea);
document.querySelector("#loginWrapper form").addEventListener("submit",(event) =>{
    event.preventDefault()
    auth()
})
function activeArea() {
    const field = document.getElementsByClassName("field");

    // Изменяем текст и стиль кнопки
    gameBtn.innerHTML = "ЗАВЕРШИТЬ ИГРУ";
    gameBtn.style.backgroundColor = "red";

    // Добавляем класс "active" с задержкой для каждого элемента
    for (let i = 0; i < field.length; i++) {
        setTimeout(() => {
            field[i].classList.add("active");
        }, 50 * i); // 50ms задержка для каждого элемента
    }
}

let USERNAME
async function auth(){
    const loginWrapper = document.getElementById("loginWrapper")
    const login = document.getElementById("login").value 
    let response = await sendRequest("user", "GET",{
        username:login
    })

    if(response.error){
        let registration = await sendRequest("user", "POST",{username:login})
        if (registration.error) {
            alert(registration.message);
          } else {
            USERNAME = login;
            loginWrapper.style.display = "none";
            updateUSerBalance();
          }       
    }else{
        USERNAME=login
        loginWrapper.style.display="none"
        updateUSerBalance()
    }
}
































async function updateUSerBalance(){
    let response= await sendRequest("user","GET",{
        username: USERNAME
    })

    if (response.error){
        alert(response.message)
    } else {
        const user = document.querySelector("header span")
        
        user.innerHTML = `Пользователь ${response.username} с балансом ${response.balance}`
    }
    console.log(response);
}


updateUSerBalance()
async function sendRequest(url, method, data) {
    url = `https://tg-api.tehnikum.school/tehnikum_course/minesweeper/${url}`
    
    if(method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    
        response = await response.json()
        return response
    } else if(method == "GET") {
        url = url+"?"+ new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        response = await response.json()
        return response
    }
}
