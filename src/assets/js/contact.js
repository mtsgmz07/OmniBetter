document.addEventListener('DOMContentLoaded', function () {
    let placeholder = document.querySelector(".main__contact__rigth__form__requestType__placeholder__content")
    let content = document.querySelector(".main__contact__rigth__form__requestType__content")
    let arrow = document.querySelector(".main__contact__rigth__form__requestType__placeholder__content i")

    if (placeholder.classList.contains('disabled')) return

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


    document.querySelectorAll(".main__contact__rigth__form__requestType__content p")
        .forEach((container, index) => {
            container.addEventListener("click", (event) => {
                document.querySelector(".main__contact__rigth__form__requestType__placeholder__content p").innerText = event.currentTarget.innerText
                document.querySelector(".main__contact__rigth__form__requestType__hidden").value = index
                placeholder.classList.toggle("active")
                content.classList.toggle("active")
                arrow.classList.toggle("active")
                if (checkForm()) document.querySelector(".main__contact__rigth__form__submit input").disabled = false
                else document.querySelector(".main__contact__rigth__form__submit input").disabled = true
            })
        })
});

document.addEventListener('input', (inputEvent) => {
    if (["inputName", "inputSurname"].includes(inputEvent.target.name) && (inputEvent.target.value.length < 3 || inputEvent.target.value.length > 50)) {
        console.log(["inputName", "inputSurname"].includes(inputEvent.target.name));
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = 'Ce champ doit contenir entre 3 et 50 caractères'
    } else if (["inputName", "inputSurname"].includes(inputEvent.target.name)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''
    }

    if (inputEvent.target.name === "inputEmail" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(inputEvent.target.value)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = 'Adresse e-mail invalide'
    } else if (inputEvent.target.name === "inputEmail") {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''
    }

    if (checkForm()) document.querySelector(".main__contact__rigth__form__submit input").disabled = false
    else document.querySelector(".main__contact__rigth__form__submit input").disabled = true
})

function checkForm() {
    if (
        (
            document.querySelector(".main__contact__rigth__form__nameAndSurname__name input").value.length >= 3 &&
            document.querySelector(".main__contact__rigth__form__nameAndSurname__name input").value.length < 50
        )
        &&
        (
            document.querySelector(".main__contact__rigth__form__nameAndSurname__surname input").value.length >= 3 &&
            document.querySelector(".main__contact__rigth__form__nameAndSurname__surname input").value.length < 50
        )
        &&
        (
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(document.querySelector(".main__contact__rigth__form__mail input").value)
        )
        &&
        (
            document.querySelector('.main__contact__rigth__form__requestType__hidden').value.length > 0
        )
        &&
        (
            document.querySelector('.main__contact__rigth__form__message textarea').value.length > 0
        )
    ) return true
    else return false
}
