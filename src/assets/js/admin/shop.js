document.addEventListener('DOMContentLoaded', function () {
    let placeholderFilter = document.querySelector(".body__main__findArticle__findByCategory__placeholder")
    let contentFilter = document.querySelector(".body__main__findArticle__findByCategory__select")
    let arrowFilter = document.querySelector(".body__main__findArticle__findByCategory__placeholder i")

    let placeholderCateogry = document.querySelector(".body__main__popup__content__form__selectCategory__placeholder__content")
    let contentCategory = document.querySelector(".body__main__popup__content__form__selectCategory__select")
    let arrowCategory = document.querySelector(".body__main__popup__content__form__selectCategory__placeholder__content i")

    if (placeholderCateogry?.classList.contains('disabled')) return

    document?.addEventListener('click', function (event) {
        if (contentCategory?.classList?.contains('active') && !contentCategory?.contains(event.target)) {
            placeholderCateogry?.classList?.toggle("active")
            contentCategory?.classList?.toggle("active")
            arrowCategory?.classList?.toggle("active")
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

    placeholderCateogry?.addEventListener("click", (event) => {
        event.stopPropagation()
        placeholderCateogry?.classList?.toggle("active")
        contentCategory?.classList?.toggle("active")
        arrowCategory?.classList?.toggle("active")
    })

    document.querySelectorAll(".body__main__popup__content__form__selectCategory__select span").forEach((container) => {
        container.addEventListener("click", () => {
            document.querySelector(".body__main__popup__content__form__selectCategory__placeholder__content p").innerText = container.innerText
            document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value = container.getAttribute("aria-value")
            if (Number(container.getAttribute("aria-value")) === 0) document.querySelector(".body__main__popup__content__form__game").style.display = "flex"
            else document.querySelector(".body__main__popup__content__form__game").style.display = "none"
            placeholderCateogry?.classList?.toggle("active")
            contentCategory?.classList?.toggle("active")
            arrowCategory?.classList?.toggle("active")
            document.querySelector(`.small__form__category`).innerHTML = ''
            if (isValidForm()) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
            else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
        })
    })
})

$(document).on("input", 'input[name="findDesktop"]', function (eventInput) {
    if ($(this).val().length > 0) {
        $.ajax({
            url: "/admin/shop/" + $(this).val() + "/search",
            type: "POST",
            dataType: "json",
            data: {},
            success: function (data) {
                console.log(data.desktop);
                const arrayDesktop = data.desktop;
                $('.body__main__article__manager').html(`
                <a href="/admin/shop?create=0" class="body__main__article__manager__addArticleContainer">
                <i class="fa-solid fa-plus"></i>
                </a>
                `);
                for (let i = 0; i < arrayDesktop.length; i++) {
                    let containerOfDesktop = document.createElement("a");
                    containerOfDesktop.className = "body__main__article__manager__container";
                    containerOfDesktop.href = `/admin/shop/edit/${arrayDesktop[i].desktop_id}`
                    containerOfDesktop.innerHTML = `
                    <article class="body__main__article__manager__container__article">
                    <div class="body__main__article__manager__container__article__picture">
                    <img src="${(arrayDesktop[i].image.find(x => x.index === 0)).link}" alt="image.png">
                    </div>
                    <div class="body__main__article__manager__container__article__title">
                    <h3>${arrayDesktop[i].title}</h3>
                    </div>
                    <section class="body__main__article__manager__container__article__configuration">
                    <div class="body__main__article__manager__container__article__configuration__cpu">
                    <img src="/upload/icons8-processor-32.png" alt="icons8-processor-32.png">
                    <p>${arrayDesktop[i].config.processor}</p>
                    </div>
                    <div class="body__main__article__manager__container__article__configuration__gpu">
                    <img src="/upload/icons8-gpu-32.png" alt="icons8-gpu-32.png">
                    <p>${arrayDesktop[i].config.graphic}</p>
                    </div>
                    <div class="body__main__article__manager__container__article__configuration__ram">
                    <img src="/upload/icons8-ram-32.png" alt="icons8-ram-32.png">
                    <p>${arrayDesktop[i].config.ram}</p>
                    </div>
                    <div class="body__main__article__manager__container__article__configuration__ssd">
                    <img src="/upload/icons8-ssd-32.png" alt="icons8-ssd-32.png">
                    <p>${arrayDesktop[i].config.storage}</p>
                    </div>
                    </section>
                    <section class="body__main__article__manager__container__article__price">
                    <p>${arrayDesktop[i].price} €</p>
                    <span>${arrayDesktop[i].category}</span>
                    </section>
                    </article>
                    `;
                    $('.body__main__article__manager').append(containerOfDesktop);
                }
            },
            error: function (xhr, status, error) {
                $('.body__main__article__manager').html(`
                <a href="/admin/shop?create=0" class="body__main__article__manager__addArticleContainer">
                <i class="fa-solid fa-plus"></i>
                </a>
                `);
            }
        });
    } else location.reload();
});

document.addEventListener('input', (inputEvent) => {
    if (["title", "case", "processor", "motherboard", "graphic", "ram", "cooling", "storage", "powerSupply", "os"].includes(inputEvent.target.name) && (inputEvent.target.value.length < 3 || inputEvent.target.value.length > 100)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = 'Ce champ doit contenir entre 3 et 100 caractères'
    } else if (["title", "case", "processor", "motherboard", "graphic", "ram", "cooling", "storage", "powerSupply", "os"].includes(inputEvent.target.name)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''
    }

    if (inputEvent.target.name === "price" && (inputEvent.target.value.length < 1 || inputEvent.target.value.length > 10)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = 'Ce champ doit contenir entre 1 et 10 caractères'
    } else if (inputEvent.target.name === "price") {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''
    }

    if ([
        "fortniteHigh",
        "fortniteUltra",
        "apexHigh",
        "apexUltra",
        "valorantHigh",
        "valorantUltra",
        "cyberpunkHigh",
        "cyberpunkUltra",
        "battlefieldHigh",
        "battlefieldUltra",
        "rainbowsixHigh",
        "rainbowsixUltra"
    ].includes(inputEvent.target.name) && (inputEvent.target.value.length < 1 || inputEvent.target.value.length > 3)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = 'Ce champ doit contenir entre 1 et 3 caractères'
    } else if ([
        "fortniteHigh",
        "fortniteUltra",
        "apexHigh",
        "apexUltra",
        "valorantHigh",
        "valorantUltra",
        "cyberpunkHigh",
        "cyberpunkUltra",
        "battlefieldHigh",
        "battlefieldUltra",
        "rainbowsixHigh",
        "rainbowsixUltra"
    ].includes(inputEvent.target.name)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''
    }

    if (isValidForm()) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
    else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
})

document.addEventListener("FilePond:addfile", () => {
    if (isValidForm()) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
    else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
})

document.addEventListener("FilePond:removefile", () => {
    if (isValidForm()) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
    else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
})

function isValidForm() {
    if (
        (filePondInput.getFiles().length > 0) &&
        (
            document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value.length > 0
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__descriptionOfProduct textarea").value.length > 0
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__caseOfProduct input").value.length >= 3 &&
            document.querySelector(".body__main__popup__content__form__caseOfProduct input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__processorOfProduct input").value.length >= 3 &&
            document.querySelector(".body__main__popup__content__form__processorOfProduct input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__motherboard input").value.length >= 3 &&
            document.querySelector(".body__main__popup__content__form__motherboard input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__graphicOfProduct input").value.length >= 3 &&
            document.querySelector(".body__main__popup__content__form__graphicOfProduct input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__ram input").value.length >= 3 &&
            document.querySelector(".body__main__popup__content__form__ram input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__cooling input").value.length >= 3 &&
            document.querySelector(".body__main__popup__content__form__cooling input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__storage input").value.length >= 3 &&
            document.querySelector(".body__main__popup__content__form__storage input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__powerSupply input").value.length >= 3 &&
            document.querySelector(".body__main__popup__content__form__powerSupply input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__os input").value.length >= 3 &&
            document.querySelector(".body__main__popup__content__form__os input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__popup__content__form__priceOfProduct input").value.length >= 1 &&
            document.querySelector(".body__main__popup__content__form__priceOfProduct input").value.length < 10
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__fortniteHigh input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__fortniteHigh input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__fortniteUltra input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__fortniteUltra input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__apexHigh input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__apexHigh input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__apexUltra input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__apexUltra input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__valorantHigh input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__valorantHigh input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__valorantUltra input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__valorantUltra input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__cyberpunkHigh input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__cyberpunkHigh input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__cyberpunkUltra input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__cyberpunkUltra input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__battlefieldHigh input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__battlefieldHigh input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__battlefieldUltra input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__battlefieldUltra input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__rainbowsixHigh input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__rainbowsixHigh input").value.length <= 3) : true
        ) &&
        (
            Number(document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value) === 0 ?
                (document.querySelector(".body__main__popup__content__form__rainbowsixUltra input").value.length >= 1 &&
                    document.querySelector(".body__main__popup__content__form__rainbowsixUltra input").value.length <= 3) : true
        )
    ) return true
    else return false
}

document.querySelector(".body__main__popup__content__form__submit input")?.addEventListener("click", () => {
    $(".waitRequest").addClass("active")
    $(".body__main__popup__content__form").css("display", "none")
    $(this).prop("disabled", true)
    const files = filePondInput?.getFiles();
    const base64Strings = [];
    if (files.length === 0) return location.reload()
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result.split(',')[1];
            const fileIndex = event.target.index;
            base64Strings[fileIndex] = base64String;
            if (base64Strings.filter(Boolean).length === files.length) {
                sendAjaxRequest(base64Strings);
            }
        };
        reader.index = i;
        reader.readAsDataURL(files[i]?.file);
    }

    function sendAjaxRequest(base64Strings) {
        $.ajax({
            url: `/admin/shop`,
            type: "POST",
            dataType: "json",
            data: {
                filepond: base64Strings,
                category: $(".body__main__popup__content__form__selectCategory__inputHidden").val(),
                title: $(".body__main__popup__content__form__titleOfProduct input").val(),
                description: $(".body__main__popup__content__form__descriptionOfProduct textarea").val(),
                price: $(".body__main__popup__content__form__priceOfProduct__inputPrice input").val(),
                case: $(".body__main__popup__content__form__caseOfProduct input").val(),
                processor: $(".body__main__popup__content__form__processorOfProduct input").val(),
                motherboard: $(".body__main__popup__content__form__motherboard input").val(),
                graphic: $(".body__main__popup__content__form__graphicOfProduct input").val(),
                ram: $(".body__main__popup__content__form__ram input").val(),
                cooling: $(".body__main__popup__content__form__cooling input").val(),
                storage: $(".body__main__popup__content__form__storage input").val(),
                powerSupply: $(".body__main__popup__content__form__powerSupply input").val(),
                os: $(".body__main__popup__content__form__os input").val(),
                fortniteHigh: $(".body__main__popup__content__form__fortniteHigh input").val(),
                fortniteUltra: $(".body__main__popup__content__form__fortniteUltra input").val(),
                apexHigh: $(".body__main__popup__content__form__apexHigh input").val(),
                apexUltra: $(".body__main__popup__content__form__apexUltra input").val(),
                valorantHigh: $(".body__main__popup__content__form__valorantHigh input").val(),
                valorantUltra: $(".body__main__popup__content__form__valorantUltra input").val(),
                cyberpunkHigh: $(".body__main__popup__content__form__cyberpunkHigh input").val(),
                cyberpunkUltra: $(".body__main__popup__content__form__cyberpunkUltra input").val(),
                battlefieldHigh: $(".body__main__popup__content__form__battlefieldHigh input").val(),
                battlefieldUltra: $(".body__main__popup__content__form__battlefieldUltra input").val(),
                rainbowsixHigh: $(".body__main__popup__content__form__rainbowsixHigh input").val(),
                rainbowsixUltra: $(".body__main__popup__content__form__rainbowsixUltra input").val()
            },
            success: function (data) {
                $(".waitRequest").removeClass("active")
                $(".body__main__popup__content__check").addClass("active")
            },
            error: function (data) {
                $(".waitRequest").removeClass("active")
                $(".body__main__popup__content__form").css("display", "flex")
                $(".body__main__popup__content__form__submit input").prop("disabled", true)
                let arrayData = JSON.parse(data.responseText)
                if (!arrayData) return location.reload()
                for (let i = 0; i < arrayData.length; i++) {
                    document.querySelector("." + arrayData[i].class).innerText = arrayData[i].value
                }
                document.querySelector("." + arrayData[0].label).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
            }
        })
    }
})