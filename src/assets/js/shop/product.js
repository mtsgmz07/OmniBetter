document.addEventListener('DOMContentLoaded', function () {
    let placeholder = document.querySelector(".body__main__presentation__description__option__placeholder__content")
    let content = document.querySelector(".body__main__presentation__description__option__content")
    let arrow = document.querySelector(".body__main__presentation__description__option__placeholder__content i")

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


    document.querySelectorAll(".body__main__presentation__description__option__content div")
        .forEach((container, index) => {
            container.addEventListener("click", (event) => {
                document.querySelector(".body__main__presentation__description__option__placeholder__content p").innerText = document.querySelectorAll("." + event.currentTarget.classList[0] + " p")[0].innerText
                document.querySelector(".body__main__presentation__description__buy__form__option").value = index
                placeholder.classList.toggle("active")
                content.classList.toggle("active")
                arrow.classList.toggle("active")
            })
        })

    let minusQuantity = document.querySelector(".body__main__presentation__description__buy__form__quantity__minus")
    let placeholderQuantity = document.querySelector(".body__main__presentation__description__buy__form__quantity__placeholder")
    let inputQuantity = document.querySelector(".body__main__presentation__description__buy__form__quantity")
    let plusQuantity = document.querySelector(".body__main__presentation__description__buy__form__quantity__plus")

    minusQuantity.addEventListener("click", () => {
        if (isNaN(Number(placeholderQuantity.innerText))) return placeholderQuantity.innerText = "1"
        if (Number(placeholderQuantity.innerText) <= 1) return
        placeholderQuantity.innerText = Number(placeholderQuantity.innerText) - 1
        inputQuantity.value = placeholderQuantity.innerText
    })

    plusQuantity.addEventListener("click", () => {
        if (isNaN(Number(placeholderQuantity.innerText))) return placeholderQuantity.innerText = "1"
        if (Number(placeholderQuantity.innerText) === 10) return
        placeholderQuantity.innerText = Number(placeholderQuantity.innerText) + 1
        inputQuantity.value = placeholderQuantity.innerText
    })
});

new Swiper(".body__main__presentation__image__swiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    }
});