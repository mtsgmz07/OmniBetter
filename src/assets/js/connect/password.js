document.querySelector(".body__main__password__form__currentPassword__input i")
    .addEventListener("click", (event) => {
        let inputPassword = document.querySelector(".body__main__password__form__currentPassword__input input")
        if (inputPassword.getAttribute("type") === "password") {
            event.target.classList = "fa-solid fa-eye"
            inputPassword.type = "text"
        } else {
            event.target.classList = "fa-solid fa-eye-slash"
            inputPassword.type = "password"
        }
    })

document.querySelector(".body__main__password__form__newPassword__input i")
    .addEventListener("click", (event) => {
        let inputPassword = document.querySelector(".body__main__password__form__newPassword__input input")
        if (inputPassword.getAttribute("type") === "password") {
            event.target.classList = "fa-solid fa-eye"
            inputPassword.type = "text"
        } else {
            event.target.classList = "fa-solid fa-eye-slash"
            inputPassword.type = "password"
        }
    })

document.querySelector(".body__main__password__form__retypePassword__input i")
    .addEventListener("click", (event) => {
        let inputPassword = document.querySelector(".body__main__password__form__retypePassword__input input")
        if (inputPassword.getAttribute("type") === "password") {
            event.target.classList = "fa-solid fa-eye"
            inputPassword.type = "text"
        } else {
            event.target.classList = "fa-solid fa-eye-slash"
            inputPassword.type = "password"
        }
    })

document.addEventListener('input', (inputEvent) => {
    if (inputEvent.target.name === "currentPassword") document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''

    if (
        inputEvent.target.name === "newPassword" &&
        !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(inputEvent.target.value)
    ) {
        document.querySelector(`.small__form__newPassword`).innerHTML = 'Votre mot de passe doit contenir 8 caractères, 1 majuscule, 1 miniscule et 1 chiffre'
    } else if (inputEvent.target.name === "newPassword") {
        if (document.querySelector(".body__main__password__form__retypePassword__input input").value === inputEvent.target.value) {
            document.querySelector(`.small__form__retypePassword`).innerHTML = ''
        } else {
            document.querySelector(`.small__form__retypePassword`).innerHTML = 'Les mots de passe ne sont pas identiques'
        }
        document.querySelector(`.small__form__newPassword`).innerHTML = ''
    }

    if (
        inputEvent.target.name === "retypePassword" &&
        inputEvent.target.value !== document.querySelector(".body__main__password__form__newPassword__input input").value
    ) {
        document.querySelector(`.small__form__retypePassword`).innerHTML = 'Les mots de passe ne sont pas identiques'
    } else if (inputEvent.target.name === "retypePassword") {
        document.querySelector(`.small__form__retypePassword`).innerHTML = ''
    }

    if (
        document.querySelector(".body__main__password__form__currentPassword__input input").value.length > 0 &&
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(document.querySelector(".body__main__password__form__newPassword__input input").value) &&
        document.querySelector(".body__main__password__form__retypePassword__input input").value === document.querySelector(".body__main__password__form__newPassword__input input").value
    ) document.querySelector(".body__main__password__form__submit input").disabled = false
    else document.querySelector(".body__main__password__form__submit input").disabled = true
})