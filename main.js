const gameBtn = document.getElementById("gameBtn")
//slushatel sobity
gameBtn.addEventListener("click", activeArea);
function activeArea() {
const field =document.getElementsByClassName("field");
gameBtn.innerHTML = "ЗАВЕРШИТЬ ИГРУ";
gameBtn.style.backgroundColor = "red";
for(let i =0; i < field.length; i++) {
    setInterval(()=>{
        field[i].classList.add("active");
    }, 50* i);

}
}