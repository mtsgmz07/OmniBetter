document.querySelector(".body__main__signup__rigth__form__password__inputPassword i")
    .addEventListener("click", (event) => {
        let inputPassword = document.querySelector(".body__main__signup__rigth__form__password__inputPassword input")
        if (inputPassword.getAttribute("type") === "password") {
            event.target.classList = "fa-solid fa-eye"
            inputPassword.type = "text"
        } else {
            event.target.classList = "fa-solid fa-eye-slash"
            inputPassword.type = "password"
        }
    })

document.querySelector(".body__main__signup__rigth__form__retypePassword__inputRetype i")
    .addEventListener("click", (event) => {
        let inputPassword = document.querySelector(".body__main__signup__rigth__form__retypePassword__inputRetype input")
        if (inputPassword.getAttribute("type") === "password") {
            event.target.classList = "fa-solid fa-eye"
            inputPassword.type = "text"
        } else {
            event.target.classList = "fa-solid fa-eye-slash"
            inputPassword.type = "password"
        }
    })

document.addEventListener('input', (inputEvent) => {
    if (["inputName", "inputSurname"].includes(inputEvent.target.name) && inputEvent.target.value.length < 3 || inputEvent.target.value.length > 50) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = 'Ce champ doit contenir entre 3 et 50 caractères'
    } else if (["inputName", "inputSurname"].includes(inputEvent.target.name)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''
    }

    if (inputEvent.target.name === "inputEmail" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(inputEvent.target.value)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = 'Adresse e-mail invalide'
    } else if (inputEvent.target.name === "inputEmail") {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''
    }

    if (
        inputEvent.target.name === "inputPhone" &&
        !/^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/.exec(inputEvent.target.value) &&
        document.querySelector('.body__main__signup__rigth__form__phone__inputHidden').value === "fr"
    ) {
        document.querySelector(`.small__form__inputPhone`).innerHTML = 'Numéro de téléphone invalide'
    } else if (inputEvent.target.name === "inputPhone" && document.querySelector('.body__main__signup__rigth__form__phone__inputHidden').value === "fr") {
        document.querySelector(`.small__form__inputPhone`).innerHTML = ''
    }

    if (
        inputEvent.target.name === "inputPhone" &&
        !/^[0-9]{2}[.\- ]{0,1}[0-9]{2}[.\- ]{0,1}[0-9]{2}[.\- ]{0,1}[0-9]{3}[.\- ]{0,1}[0-9]{2}$/.exec(inputEvent.target.value) &&
        document.querySelector('.body__main__signup__rigth__form__phone__inputHidden').value === "be"
    ) {
        document.querySelector(`.small__form__inputPhone`).innerHTML = 'Numéro de téléphone invalide'
    } else if (inputEvent.target.name === "inputPhone" && document.querySelector('.body__main__signup__rigth__form__phone__inputHidden').value === "be") {
        document.querySelector(`.small__form__inputPhone`).innerHTML = ''
    }

    if (
        inputEvent.target.name === "inputPhone" &&
        !/^([0][1-9][0-9](\s|)[0-9][0-9][0-9](\s|)[0-9][0-9](\s|)[0-9][0-9])$|^(([0][0]|\+)[1-9][0-9](\s|)[0-9][0-9](\s|)[0-9][0-9][0-9](\s|)[0-9][0-9](\s|)[0-9][0-9])$/.exec(inputEvent.target.value) &&
        document.querySelector('.body__main__signup__rigth__form__phone__inputHidden').value === "ch"
    ) {
        document.querySelector(`.small__form__inputPhone`).innerHTML = 'Numéro de téléphone invalide'
    } else if (inputEvent.target.name === "inputPhone" && document.querySelector('.body__main__signup__rigth__form__phone__inputHidden').value === "ch") {
        document.querySelector(`.small__form__inputPhone`).innerHTML = ''
    }

    if (
        inputEvent.target.name === "inputPassword" &&
        !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(inputEvent.target.value)
    ) {
        document.querySelector(`.small__form__inputPassword`).innerHTML = 'Votre mot de passe doit contenir 8 caractères, 1 majuscule, 1 miniscule et 1 chiffre'
    } else if (inputEvent.target.name === "inputPassword") {
        if (document.querySelector(".body__main__signup__rigth__form__retypePassword__inputRetype input").value === inputEvent.target.value) {
            document.querySelector(`.small__form__retypePassword`).innerHTML = ''
        } else {
            document.querySelector(`.small__form__retypePassword`).innerHTML = 'Les mots de passe ne sont pas identiques'
        }
        document.querySelector(`.small__form__inputPassword`).innerHTML = ''
    }

    if (
        inputEvent.target.name === "inputRetype" &&
        inputEvent.target.value !== document.querySelector(".body__main__signup__rigth__form__password__inputPassword input").value
    ) {
        document.querySelector(`.small__form__retypePassword`).innerHTML = 'Les mots de passe ne sont pas identiques'
    } else if (inputEvent.target.name === "inputRetype") {
        document.querySelector(`.small__form__retypePassword`).innerHTML = ''
    }

    const phoneNumberInputValue = document.querySelector(".body__main__signup__rigth__form__phone__inputPhone__input").value;
    const selectedCountryValue = document.querySelector('.body__main__signup__rigth__form__phone__inputHidden').value;
    const frenchRegex = /^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/;
    const isFrenchNumber = frenchRegex.exec(phoneNumberInputValue) && (selectedCountryValue === "fr");
    const belgianRegex = /^[0-9]{2}[.\- ]{0,1}[0-9]{2}[.\- ]{0,1}[0-9]{2}[.\- ]{0,1}[0-9]{3}[.\- ]{0,1}[0-9]{2}$/;
    const isBelgianNumber = belgianRegex.exec(phoneNumberInputValue) && (selectedCountryValue === "be");
    const swissRegex = /^([0][1-9][0-9](\s|)[0-9][0-9][0-9](\s|)[0-9][0-9](\s|)[0-9][0-9])$|^(([0][0]|\+)[1-9][0-9](\s|)[0-9][0-9](\s|)[0-9][0-9][0-9](\s|)[0-9][0-9](\s|)[0-9][0-9])$/;
    const isSwissNumber = swissRegex.exec(phoneNumberInputValue) && (selectedCountryValue === "ch");

    if (
        (
            document.querySelector(".body__main__signup__rigth__form__nameAndSurname__inputName input").value.length >= 3 &&
            document.querySelector(".body__main__signup__rigth__form__nameAndSurname__inputName input").value.length < 50
        )
        &&
        (
            document.querySelector(".body__main__signup__rigth__form__nameAndSurname__inputSurname input").value.length >= 3 &&
            document.querySelector(".body__main__signup__rigth__form__nameAndSurname__inputSurname input").value.length < 50
        )
        &&
        (
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(document.querySelector(".body__main__signup__rigth__form__inputEmail input").value)
        )
        &&
        (isFrenchNumber || isBelgianNumber || isSwissNumber)
        &&
        (
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(document.querySelector(".body__main__signup__rigth__form__password__inputPassword input").value)
        )
        &&
        (
            document.querySelector(".body__main__signup__rigth__form__password__inputPassword input").value === document.querySelector(".body__main__signup__rigth__form__retypePassword__inputRetype input").value
        )
        &&
        (
            document.querySelector(".body__main__signup__rigth__form__save input").checked
        )
    ) document.querySelector(".body__main__signup__rigth__form__submit input").disabled = false
    else document.querySelector(".body__main__signup__rigth__form__submit input").disabled = true
})

document.addEventListener('DOMContentLoaded', function () {
    let placeholder = document.querySelector(".body__main__signup__rigth__form__phone__inputPhone__flag__placeholder")
    let content = document.querySelector(".body__main__signup__rigth__form__phone__inputPhone__flag__content")
    let arrow = document.querySelector(".body__main__signup__rigth__form__phone__inputPhone__flag__placeholder i")

    document.addEventListener('click', function (event) {
        if (content.classList.contains('active') && !content.contains(event.target)) {
            placeholder.classList.toggle("active")
            content.classList.toggle("active")
            arrow.classList.toggle("active")
        }
    });

    placeholder.addEventListener("click", (event) => {
        event.stopPropagation()
        placeholder.classList.toggle("active")
        content.classList.toggle("active")
        arrow.classList.toggle("active")
    })


    document.querySelectorAll(".body__main__signup__rigth__form__phone__inputPhone__flag__content img")
        .forEach((container, index) => {
            container.addEventListener("click", (event) => {
                let currentIso = document.querySelector(".body__main__signup__rigth__form__phone__inputPhone__flag__placeholder img").getAttribute("value")
                document.querySelector(".body__main__signup__rigth__form__phone__inputPhone__flag__placeholder img").src = "/upload/" + container.getAttribute("value").replace('be', "belgique.png").replace('fr', "france.webp").replace('ch', "suisse.png")
                document.querySelector(".body__main__signup__rigth__form__phone__inputPhone__flag__placeholder img").setAttribute("value", container.getAttribute("value"))
                container.src = "/upload/" + currentIso.replace('be', "belgique.png").replace('fr', "france.webp").replace('ch', "suisse.png")
                document.querySelector(".body__main__signup__rigth__form__phone__inputHidden").value = container.getAttribute("value")
                container.setAttribute("value", currentIso)
                placeholder.classList.toggle("active")
                content.classList.toggle("active")
                arrow.classList.toggle("active")
                document.querySelector(".body__main__signup__rigth__form__phone__inputPhone__input").value = ""
                document.querySelector(".body__main__signup__rigth__form__submit input").disabled = true
            })
        })
});



