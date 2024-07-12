document.addEventListener('DOMContentLoaded', function () {
    let placeholderFilter = document.querySelector(".body__main__path__findPromotion__findByPromotion__placeholder")
    let contentFilter = document.querySelector(".body__main__path__findPromotion__findByPromotion__select")
    let arrowFilter = document.querySelector(".body__main__path__findPromotion__findByPromotion__placeholder i")

    let placeholderType = document.querySelector(".body__main__popup__content__form__selectType__placeholder__content")
    let contentType = document.querySelector(".body__main__popup__content__form__selectType__select")
    let arrowType = document.querySelector(".body__main__popup__content__form__selectType__placeholder__content i")

    if (placeholderType?.classList.contains('disabled')) return

    document?.addEventListener('click', function (event) {
        if (placeholderType?.classList?.contains('active') && !placeholderType?.contains(event.target)) {
            placeholderType?.classList?.toggle("active")
            contentType?.classList?.toggle("active")
            arrowType?.classList?.toggle("active")
        }

        if (contentFilter?.classList?.contains('active') && !contentFilter?.contains(event.target)) {
            placeholderFilter?.classList?.toggle("active")
            contentFilter?.classList?.toggle("active")
            arrowFilter?.classList?.toggle("active")
        }
    });

    placeholderFilter?.addEventListener("click", (event) => {
        event.stopPropagation()
        placeholderFilter?.classList?.toggle("active")
        contentFilter?.classList?.toggle("active")
        arrowFilter?.classList?.toggle("active")
    })

    placeholderType?.addEventListener("click", (event) => {
        event.stopPropagation()
        placeholderType?.classList?.toggle("active")
        contentType?.classList?.toggle("active")
        arrowType?.classList?.toggle("active")
    })

    document.querySelectorAll(".body__main__popup__content__form__selectType__select span").forEach((container) => {
        container.addEventListener("click", () => {
            document.querySelector(".body__main__popup__content__form__selectType__placeholder__content p").innerText = container.innerText
            document.querySelector(".body__main__popup__content__form__selectType__inputHidden").value = container.getAttribute("aria-value")
            placeholderType?.classList?.toggle("active")
            contentType?.classList?.toggle("active")
            arrowType?.classList?.toggle("active")
            document.querySelector(`.small__form__type`).innerHTML = ''
            if (Number(document.querySelector(".body__main__popup__content__form__reduction input").value) > 100 && document.querySelector(".body__main__popup__content__form__selectType__inputHidden").value === "0") {
                document.querySelector('.small__form__reduction').innerText = "Ce champs doit contenir un nombre inférieur a 100"
            } else {
                document.querySelector('.small__form__reduction').innerText = ""
            }
            if (isValidForm()) document.querySelector(".body__main__popup__content__form__submit button").disabled = false
            else document.querySelector(".body__main__popup__content__form__submit button").disabled = true
        })
    })
})

document.addEventListener("input", (inputEvent) => {
    if (inputEvent.target.name === "findPromotion" && inputEvent.target.value.length > 0) {
        $.ajax({
            url: "/admin/promotion/" + inputEvent.target.value + "/search",
            type: "POST",
            dataType: "json",
            data: {},
            success: function (data) {
                const arrayPromotion = data.promotion;
                $('.body__main__allPromotion').html(`
            <a href="/admin/promotion?create=0" class="body__main__allPromotion__addContainer">
            <i class="fa-solid fa-plus"></i>
            </a>
            `);
                for (let i = 0; i < arrayPromotion.length; i++) {
                    let containerOfPromotion = document.createElement("section");
                    containerOfPromotion.className = "body__main__allPromotion__container";
                    containerOfPromotion.innerHTML = `    
                <div class="body__main__allPromotion__container__icon">
                  <i class="fa-solid fa-gift"></i>
                </div>
                <div class="body__main__allPromotion__container__content">
                  <p class="body__main__allPromotion__container__content__title">${arrayPromotion[i].code}</p>
                  <p>
                    Valeur: ${arrayPromotion[i].value}<br>
                    Première commande: ${arrayPromotion[i].firstCommand}<br>
                    Limite d'utilisation: ${arrayPromotion[i].limitRedemption}<br>
                    Montant minimum: ${arrayPromotion[i].minimumAmount}<br>
                    Créer le: ${arrayPromotion[i].create_time}<br>
                    Expire le: ${arrayPromotion[i].expire}<br>
                  </p>
                </div>
                <div class="body__main__allPromotion__container__action">
                  <button id="${arrayPromotion[i].code}" value="${arrayPromotion[i].promotion_id}">Supprimer</button>
                </div>
                `;
                    $('.body__main__allPromotion').append(containerOfPromotion);
                }
            },
            error: function (xhr, status, error) {
                $('.body__main__allPromotion').html(`
            <a href="/admin/promotion?create=0" class="body__main__allPromotion__addContainer">
            <i class="fa-solid fa-plus"></i>
            </a>
            `);
            }
        });
    }

    if (inputEvent.target.name === "limitUseCheck") document.querySelector(".body__main__popup__content__form__condition__limitUse__input").classList.toggle("active")
    if (inputEvent.target.name === "minPriceCheck") document.querySelector(".body__main__popup__content__form__condition__minPrice__input").classList.toggle("active")

    if (inputEvent.target.name === "code" && (inputEvent.target.value.length < 2 || inputEvent.target.value.length > 20)) {
        document.querySelector('.small__form__code').innerText = "Ce champ doit contenir entre 2 et 20 caractères"
    } else if (inputEvent.target.name === "code") {
        document.querySelector('.small__form__code').innerText = ""
    }

    if (inputEvent.target.name === "reduction" && isNaN(Number(inputEvent.target.value))) {
        document.querySelector('.small__form__reduction').innerText = "Ce champs doit contenir un nombre"
    } else if (inputEvent.target.name === "reduction" && (Number(inputEvent.target.value) > 100 && document.querySelector(".body__main__popup__content__form__selectType__inputHidden").value === "0")) {
        document.querySelector('.small__form__reduction').innerText = "Ce champs doit contenir un nombre inférieur a 100"
    } else if (inputEvent.target.name === "reduction") {
        document.querySelector('.small__form__reduction').innerText = ""
    }

    if (inputEvent.target.name === "expire" && isNaN(new Date(inputEvent.target.value).getTime())) {
        document.querySelector('.small__form__expire').innerText = "Veuillez entrer une date valide"
    } else if (inputEvent.target.name === "expire" && (new Date(inputEvent.target.value) > new Date(new Date().setFullYear(new Date().getFullYear() + 1)))) {
        document.querySelector('.small__form__expire').innerText = "La date saisie doit être inférieure à un an à partir de la date actuelle"
    } else if (inputEvent.target.name === "expire" && (new Date(inputEvent.target.value) < new Date())) {
        document.querySelector('.small__form__expire').innerText = "La date saisie doit être supérieur à la date actuelle"
    } else if (inputEvent.target.name === "expire") {
        document.querySelector('.small__form__expire').innerText = ""
    }

    if (inputEvent.target.name === "limitUse" && isNaN(Number(inputEvent.target.value)) && document.getElementById("limitUseId").checked) {
        document.querySelector('.small__form__limitUse').innerText = "Ce champs doit contenir un nombre"
    } else if (inputEvent.target.name === "limitUse") {
        document.querySelector('.small__form__limitUse').innerText = ""
    }

    if (inputEvent.target.name === "minPrice" && isNaN(Number(inputEvent.target.value)) && document.getElementById("minPriceId").checked) {
        document.querySelector('.small__form__minPrice').innerText = "Ce champs doit contenir un nombre"
    } else if (inputEvent.target.name === "minPrice") {
        document.querySelector('.small__form__minPrice').innerText = ""
    }

    if (isValidForm()) document.querySelector(".body__main__popup__content__form__submit button").disabled = false
    else document.querySelector(".body__main__popup__content__form__submit button").disabled = true
})

function isValidForm() {
    if (
        (
            document.querySelector(".body__main__popup__content__form__code input")?.value?.length >= 2 &&
            document.querySelector(".body__main__popup__content__form__code input")?.value?.length <= 20
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__selectType__inputHidden")?.value?.length > 0
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__reduction input")?.value) > 100 && document.querySelector(".body__main__popup__content__form__selectType__inputHidden")?.value === "0" ? false : true
        ) &&
        (
            !isNaN(new Date(document.querySelector(".body__main__popup__content__form__expire input")?.value).getTime()) &&
            (new Date(document.querySelector(".body__main__popup__content__form__expire input")?.value) < new Date(new Date().setFullYear(new Date().getFullYear() + 1))) &&
            (new Date(document.querySelector(".body__main__popup__content__form__expire input")?.value) > new Date())
        ) &&
        (
            document.getElementById("limitUseId")?.checked ? document.querySelector(".body__main__popup__content__form__condition__limitUse__input input")?.value.length > 0 : true
        ) &&
        (
            document.getElementById("minPriceId")?.checked ? document.querySelector(".body__main__popup__content__form__condition__minPrice__input input")?.value.length > 0 : true
        ) &&
        (
            document.getElementById("limitUseId")?.checked && isNaN(Number(document.querySelector(".body__main__popup__content__form__condition__limitUse__input input")?.value)) ? false : true
        ) &&
        (
            document.getElementById("minPriceId")?.checked && isNaN(Number(document.querySelector(".body__main__popup__content__form__condition__minPrice__input input")?.value)) ? false : true
        )
    ) return true
    else return false
}

document.querySelector(".body__main__popup__content__form__submit button")?.addEventListener("click", () => {
    $(".waitRequest").addClass("active")
    $(".body__main__popup__content__form").css("display", "none")
    $(this).prop("disabled", true)
    $.ajax({
        url: `/admin/promotion/create`,
        type: "POST",
        dataType: "json",
        data: {
            code: $(".body__main__popup__content__form__code input").val(),
            type: Number($(".body__main__popup__content__form__selectType__inputHidden").val()),
            reduction: $(".body__main__popup__content__form__reduction input").val(),
            expire: $(".body__main__popup__content__form__expire input").val(),
            firstCommand: $("#firstCommandId").prop("checked"),
            limitCheck: $("#limitUseId").prop("checked"),
            limitInput: $(".body__main__popup__content__form__condition__limitUse__input input").val(),
            minPriceCheck: $("#minPriceId").prop("checked"),
            minPriceInput: $(".body__main__popup__content__form__condition__minPrice__input input").val()
        },
        success: function (data) {
            $(".waitRequest").removeClass("active")
            $(".body__main__popup__content__check").addClass("active")
        },
        error: function (data) {
            $(".waitRequest").removeClass("active")
            $(".body__main__popup__content__form").css("display", "flex")
            let arrayData = JSON.parse(data.responseText)
            if (!arrayData || arrayData.error) return $(".body__main__popup__content__error").addClass("active")
            for (let i = 0; i < arrayData.length; i++) {
                document.querySelector("." + arrayData[i].class).innerText = arrayData[i].value
            }
            document.querySelector("." + arrayData[0].label).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        }
    })
})

document.querySelectorAll(".body__main__allPromotion__container__action button").forEach(container => {
    container.addEventListener("click", () => {
        if (confirm(`Voulez-vous vraiment supprimer le code ${container.id} ?`)) {
            $.ajax({
                url: `/admin/promotion/${container.value}/delete`,
                type: "POST",
                dataType: "json",
                data: {},
                success: function (data) {
                    alert(`Le code ${container.id} a bien été supprimer !`)
                    location.reload()
                },
                error: function (data) {
                    alert("Une erreur vient de se produire, veuillez ressayer !")
                }
            })
        }
    })
})