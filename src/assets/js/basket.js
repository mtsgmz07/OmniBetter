document.addEventListener('DOMContentLoaded', function () {
    let placeholder = document.querySelector(".body__main__popup__content__form__selectAssembly__placeholder__content")
    let content = document.querySelector(".body__main__popup__content__form__selectAssembly__option__content")
    let arrow = document.querySelector(".body__main__popup__content__form__selectAssembly__placeholder__content i")

    document.addEventListener('click', function (event) {
        if (content?.classList.contains('active') && !content?.contains(event?.target)) {
            placeholder.classList.toggle("active")
            content.classList.toggle("active")
            arrow.classList.toggle("active")
        }
    });

    placeholder?.addEventListener("click", (event) => {
        event.stopPropagation()
        placeholder.classList.toggle("active")
        content.classList.toggle("active")
        arrow.classList.toggle("active")
    })


    document.querySelectorAll(".body__main__popup__content__form__selectAssembly__option__content div")
        .forEach((container, index) => {
            container.addEventListener("click", (event) => {
                document.querySelector(".body__main__popup__content__form__selectAssembly__placeholder__content p").innerText = document.querySelectorAll("." + event.currentTarget.classList[0] + " p")[0].innerText
                document.querySelector(".body__main__popup__content__form__selectAssembly__inputHidden").value = index
                placeholder.classList.toggle("active")
                content.classList.toggle("active")
                arrow.classList.toggle("active")
            })
        })

    let minusQuantity = document.querySelector(".body__main__popup__content__form__quantity__input__minus")
    let placeholderQuantity = document.querySelector(".body__main__popup__content__form__quantity__input__placeholder")
    let inputQuantity = document.querySelector(".body__main__popup__content__form__quantity__inputHidden")
    let plusQuantity = document.querySelector(".body__main__popup__content__form__quantity__input__plus")

    minusQuantity?.addEventListener("click", () => {
        if (isNaN(Number(placeholderQuantity.innerText))) return placeholderQuantity.innerText = "1"
        if (Number(placeholderQuantity.innerText) <= 1) return
        placeholderQuantity.innerText = Number(placeholderQuantity.innerText) - 1
        inputQuantity.value = placeholderQuantity.innerText
    })

    plusQuantity?.addEventListener("click", () => {
        if (isNaN(Number(placeholderQuantity.innerText))) return placeholderQuantity.innerText = "1"
        if (Number(placeholderQuantity.innerText) === 10) return
        placeholderQuantity.innerText = Number(placeholderQuantity.innerText) + 1
        inputQuantity.value = placeholderQuantity.innerText
    })
});

document.querySelectorAll(".deleteComputer").forEach((container, index) => {
    container.addEventListener("click", () => {
        if (confirm(`Voulez-vous vraiment supprimer l'ordinateur de votre panier ?`)) {
            $.ajax({
                url: `/basket/delete`,
                type: "POST",
                dataType: "json",
                data: {
                    desktop_id: document.querySelectorAll(".deleteComputer")[index].id,
                    assembly: document.querySelectorAll(".deleteComputer")[index].getAttribute("aria-assembly")
                },
                success: function (data) {
                    alert(`L'ordinateur a bien été supprimer de votre panier !`)
                    location.replace("/basket")
                },
                error: function (data) {
                    console.log(data);
                    alert("Une erreur vient de se produire, veuillez ressayer !")
                }
            })
        }
    })
})

document.querySelector(".body__main__popup__content__form__submit input")?.addEventListener("click", () => {
    $.ajax({
        url: `/basket/edit`,
        type: "POST",
        dataType: "json",
        data: {
            desktop_id: $(".body__main__popup__content__form__desktopId__inputHidden").val(),
            quantity: $(".body__main__popup__content__form__quantity__inputHidden").val(),
            assembly: $(".body__main__popup__content__form__selectAssembly__inputHidden").val(),
            lastAssembly: $(".body__main__popup__content__form__lastAssembly__inputHidden").val()
        },
        success: function (data) {
            $(".body__main__popup__content__error").removeClass("active")
            $(".body__main__popup__content__form").css("display", "none")
            $(".body__main__popup__content__check").addClass("active")
        },
        error: function (data) {
            $(".body__main__popup__content__error").addClass("active")
        }
    })
})

document.querySelector(".body__main__basket__total__checkout__success span").addEventListener("click", () => {
    $(".body__main__loading").addClass("active")
    $.ajax({
        url: `/basket`,
        type: "POST",
        dataType: "json",
        data: {},
        success: function (data) {
            console.log(data);
            location.replace(data.redirect_url)
        },
        error: function (data) {
            console.log(data);
            // location.reload()
        }
    })
})