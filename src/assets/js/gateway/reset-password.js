document.querySelector(".body__main__editPassword__rigth__form__password__input i")
    ?.addEventListener("click", (event) => {
        let inputPassword = document.querySelector(".body__main__editPassword__rigth__form__password__input input")
        if (inputPassword.getAttribute("type") === "password") {
            event.target.classList = "fa-solid fa-eye"
            inputPassword.type = "text"
        } else {
            event.target.classList = "fa-solid fa-eye-slash"
            inputPassword.type = "password"
        }
    })

document.querySelector(".body__main__editPassword__rigth__form__retype__input i")
    ?.addEventListener("click", (event) => {
        let inputPassword = document.querySelector(".body__main__editPassword__rigth__form__retype__input input")
        if (inputPassword.getAttribute("type") === "password") {
            event.target.classList = "fa-solid fa-eye"
            inputPassword.type = "text"
        } else {
            event.target.classList = "fa-solid fa-eye-slash"
            inputPassword.type = "password"
        }
    })

document.addEventListener('input', (inputEvent) => {
    if (document.querySelector(".body__main__resetPassword__rigth__form__email input")) {
        if (
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(document.querySelector(".body__main__resetPassword__rigth__form__email input").value)
        ) document.querySelector(".body__main__resetPassword__rigth__form__submit button").disabled = false
        else document.querySelector(".body__main__resetPassword__rigth__form__submit button").disabled = true
    } else {
        if (
            inputEvent.target.name === "inputPassword" &&
            !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(inputEvent.target.value)
        ) {
            document.querySelector(`.small__form__inputPassword`).innerHTML = 'Votre mot de passe doit contenir 8 caractères, 1 majuscule, 1 miniscule et 1 chiffre'
        } else if (inputEvent.target.name === "inputPassword") {
            if (document.querySelector(".body__main__editPassword__rigth__form__retype__input input").value === inputEvent.target.value) {
                document.querySelector(`.small__form__retypePassword`).innerHTML = ''
            } else {
                document.querySelector(`.small__form__retypePassword`).innerHTML = 'Les mots de passe ne sont pas identiques'
            }
            document.querySelector(`.small__form__inputPassword`).innerHTML = ''
        }

        if (
            inputEvent.target.name === "inputRetype" &&
            inputEvent.target.value !== document.querySelector(".body__main__editPassword__rigth__form__password__input input").value
        ) {
            document.querySelector(`.small__form__retypePassword`).innerHTML = 'Les mots de passe ne sont pas identiques'
        } else if (inputEvent.target.name === "inputRetype") {
            document.querySelector(`.small__form__retypePassword`).innerHTML = ''
        }

        if (
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(document.querySelector(".body__main__editPassword__rigth__form__password__input input").value)
            &&
            document.querySelector(".body__main__editPassword__rigth__form__password__input input").value === document.querySelector(".body__main__editPassword__rigth__form__retype__input input").value
        ) document.querySelector(".body__main__editPassword__rigth__form__submit button").disabled = false
        else document.querySelector(".body__main__editPassword__rigth__form__submit button").disabled = true
    }

})

