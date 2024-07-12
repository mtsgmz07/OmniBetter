document.querySelector(".body__main__email__form__password__input i")
    .addEventListener("click", (event) => {
        let inputPassword = document.querySelector(".body__main__email__form__password__input input")
        if (inputPassword.getAttribute("type") === "password") {
            event.target.classList = "fa-solid fa-eye"
            inputPassword.type = "text"
        } else {
            event.target.classList = "fa-solid fa-eye-slash"
            inputPassword.type = "password"
        }
    })

document.addEventListener('input', (inputEvent) => {
    if (inputEvent.target.name === "inputNewEmail" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(inputEvent.target.value)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = 'Adresse e-mail invalide'
    } else if (inputEvent.target.name === "inputNewEmail") {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''
    }

    if (inputEvent.target.name === "inputPassword") document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''

    if (
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(document.querySelector(".body__main__email__form__newEmail input").value) &&
        document.querySelector(".body__main__email__form__password__input input").value.length > 0
    ) document.querySelector(".body__main__email__form__submit input").disabled = false
    else document.querySelector(".body__main__email__form__submit input").disabled = true
})
