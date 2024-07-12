document.querySelector(".body__main__login__rigth__form__password__input i")
    .addEventListener("click", (event) => {
        let inputPassword = document.querySelector(".body__main__login__rigth__form__password__input input")
        if (inputPassword.getAttribute("type") === "password") {
            event.target.classList = "fa-solid fa-eye"
            inputPassword.type = "text"
        } else {
            event.target.classList = "fa-solid fa-eye-slash"
            inputPassword.type = "password"
        }
    })

document.addEventListener('input', () => {
    if(
        document.querySelector(".body__main__login__rigth__form__email input").value.length > 0 &&
        document.querySelector(".body__main__login__rigth__form__password__input input").value.length > 0
    ) document.querySelector(".body__main__login__rigth__form__submit input").disabled = false
    else document.querySelector(".body__main__login__rigth__form__submit input").disabled = true
})

