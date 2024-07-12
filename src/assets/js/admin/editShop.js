document.addEventListener('DOMContentLoaded', function () {
    let placeholderEditCateogry = document.querySelector(".body__main__editDesktop__information__manager__selectCategory__placeholder__content")
    let contentEditCategory = document.querySelector(".body__main__editDesktop__information__manager__selectCategory__select")
    let arrowEditCategory = document.querySelector(".body__main__editDesktop__information__manager__selectCategory__placeholder__content i")

    if (placeholderEditCateogry?.classList.contains('disabled')) return

    document?.addEventListener('click', function (event) {
        if (contentEditCategory?.classList?.contains('active') && !contentEditCategory?.contains(event.target)) {
            placeholderEditCateogry?.classList?.toggle("active")
            contentEditCategory?.classList?.toggle("active")
            arrowEditCategory?.classList?.toggle("active")
        }
    });

    placeholderEditCateogry?.addEventListener("click", (event) => {
        event.stopPropagation()
        placeholderEditCateogry?.classList?.toggle("active")
        contentEditCategory?.classList?.toggle("active")
        arrowEditCategory?.classList?.toggle("active")
    })

    document.querySelectorAll(".body__main__editDesktop__information__manager__selectCategory__select span").forEach((container) => {
        container.addEventListener("click", () => {
            document.querySelector(".body__main__editDesktop__information__manager__selectCategory__placeholder__content p").innerText = container.innerText
            document.querySelector(".body__main__editDesktop__information__manager__selectCategory__select__editCategory").value = container.getAttribute("aria-value")
            placeholderEditCateogry?.classList?.toggle("active")
            contentEditCategory?.classList?.toggle("active")
            arrowEditCategory?.classList?.toggle("active")
            document.querySelector(`.small__form__category`).innerHTML = ''
            if (isValidFormInformation()) document.querySelector(".body__main__editDesktop__information__submit button").disabled = false
            else document.querySelector(".body__main__editDesktop__information__submit button").disabled = true
        })
    })
})

document.addEventListener("FilePond:addfile", () => {
    if (filePondInput.getFiles().length > 0) document.querySelector(".body__main__editDesktop__image__submit button").disabled = false
    else document.querySelector(".body__main__editDesktop__image__submit button").disabled = true
})

document.addEventListener("FilePond:removefile", () => {
    if (filePondInput.getFiles().length > 0) document.querySelector(".body__main__editDesktop__image__submit button").disabled = false
    else document.querySelector(".body__main__editDesktop__image__submit button").disabled = true
})



document.querySelector(".body__main__editDesktop__image__submit button")?.addEventListener("click", function () {
    $(this).text("Traitement en cours ...");
    $(this).prop("disabled", true)
    const files = filePondInput?.getFiles();
    const base64Strings = [];
    if (files.length === 0) return;

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
            url: `/admin/shop/edit/${$(".desktop_id").val()}/image`,
            type: "POST",
            dataType: "json",
            data: {
                editImage: base64Strings,
            },
            success: function (data) {
                $(".body__main__editDesktop__image__submit button").text("Valider");
                $(".body__main__editDesktop__image__check").addClass('active')
                setTimeout(() => {
                    $(".body__main__editDesktop__image__check").removeClass('active')
                }, 3000)
            },
            error: function (data) {
                $(".body__main__editDesktop__image__submit button").text("Valider");
                let arrayData = JSON.parse(data.responseText)
                document.querySelector("." + arrayData.class).innerText = arrayData.value
                document.querySelector("." + arrayData.label).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
            }
        })
    }
})

document.addEventListener("input", (inputEvent) => {
    if (["editTitle", "editDescription", "editPrice"].includes(inputEvent.target.name)) {
        console.log("ici");
        if (inputEvent.target.name === "editTitle" && (inputEvent.target.value.length < 1 || inputEvent.target.value.length > 100)) {
            document.querySelector(".small__form__" + inputEvent.target.name).innerText = "Ce champ doit faire entre 1 et 100 caractères"
        } else if (inputEvent.target.name === "editTitle") {
            document.querySelector(".small__form__" + inputEvent.target.name).innerText = ""
        }

        if (inputEvent.target.name === "editDescription" && (inputEvent.target.value.length < 10 || inputEvent.target.value.length > 2048)) {
            document.querySelector(".small__form__" + inputEvent.target.name).innerText = "Ce champ doit faire entre 10 et 2048 caractères"
        } else if (inputEvent.target.name === "editDescription") {
            document.querySelector(".small__form__" + inputEvent.target.name).innerText = ""
        }

        if (inputEvent.target.name === "editPrice" && isNaN(Number(inputEvent.target.value.replace(",", "").replace(".", "")))) {
            document.querySelector(".small__form__" + inputEvent.target.name).innerText = "Ce champ doit contenir un nombre"
        }
        else if (inputEvent.target.name === "editPrice" && (inputEvent.target.value.indexOf('.') !== -1 && inputEvent.target.value.split('.')[1].length > 2)) {
            document.querySelector(".small__form__" + inputEvent.target.name).innerText = `Ce champ ne peut pas avoir plus de 2 chiffres après la virgule`
        }
        else if (inputEvent.target.name === "editPrice") {
            document.querySelector(".small__form__" + inputEvent.target.name).innerText = ""
        }

        if (isValidFormInformation()) document.querySelector(".body__main__editDesktop__information__submit button").disabled = false
        else document.querySelector(".body__main__editDesktop__information__submit button").disabled = true
    }

    if (["editTitle", "editCase", "editProcessor", "editMotherBoard", "editGraphic", "editRam", "editCooling", "editStorage", "editPowerSupply", "editOs"].includes(inputEvent.target.name) && (inputEvent.target.value.length < 3 || inputEvent.target.value.length > 100)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerText = 'Ce champ doit contenir entre 3 et 100 caractères';
        if (isValidFormComponent()) document.querySelector(".body__main__editDesktop__component__manager__submit button").disabled = false
        else document.querySelector(".body__main__editDesktop__component__manager__submit button").disabled = true
    } else if (["editTitle", "editCase", "editProcessor", "editMotherBoard", "editGraphic", "editRam", "editCooling", "editStorage", "editPowerSupply", "editOs"].includes(inputEvent.target.name)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerText = '';
        if (isValidFormComponent()) document.querySelector(".body__main__editDesktop__component__manager__submit button").disabled = false
        else document.querySelector(".body__main__editDesktop__component__manager__submit button").disabled = true
    }

    if (["editfortnitehigh", "editfortniteultra", "editapexhigh", "editapexultra", "editvaloranthigh", "editvalorantultra", "editcyberpunkhigh", "editcyberpunkultra", "editbattlefieldhigh", "editbattlefieldultra", "editrainbowsixhigh", "editrainbowsixultra"].includes(inputEvent.target.name) && (inputEvent.target.value.length < 1 || inputEvent.target.value.length > 3)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerText = 'Ce champ doit contenir entre 1 et 3 caractères';
        if (isValidFormGame()) document.querySelector(".body__main__editDesktop__game__manager__submit button").disabled = false;
        else document.querySelector(".body__main__editDesktop__game__manager__submit button").disabled = true;
    } else if (["editfortnitehigh", "editfortniteultra", "editapexhigh", "editapexultra", "editvaloranthigh", "editvalorantultra", "editcyberpunkhigh", "editcyberpunkultra", "editbattlefieldhigh", "editbattlefieldultra", "editrainbowsixhigh", "editrainbowsixultra"].includes(inputEvent.target.name)) {
        document.querySelector(`.small__form__${inputEvent.target.name}`).innerText = '';
        if (isValidFormGame()) document.querySelector(".body__main__editDesktop__game__manager__submit button").disabled = false;
        else document.querySelector(".body__main__editDesktop__game__manager__submit button").disabled = true;
    }

})

function isValidFormInformation() {
    if (
        (
            document.querySelector(".body__main__editDesktop__information__manager__selectCategory__select__editCategory").value
        ) &&
        (
            document.querySelector('.body__main__editDesktop__information__manager__title input').value.length > 1 &&
            document.querySelector('.body__main__editDesktop__information__manager__title input').value.length < 100
        ) &&
        (
            document.querySelector('.body__main__editDesktop__information__manager__description textarea').value.length >= 10 &&
            document.querySelector('.body__main__editDesktop__information__manager__description textarea').value.length < 2048
        ) &&
        (
            !isNaN(Number(document.querySelector('.body__main__editDesktop__information__manager__price input').value)) &&
            (
                document.querySelector('.body__main__editDesktop__information__manager__price input').value.indexOf('.') > -1 &&
                document.querySelector('.body__main__editDesktop__information__manager__price input').value.split('.')[1].length <= 2
            )
        )
    ) return true
    else return false
}

function isValidFormComponent() {
    if (
        (
            document.querySelector(".body__main__editDesktop__component__manager__editCase input").value.length >= 3 &&
            document.querySelector(".body__main__editDesktop__component__manager__editCase input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__editDesktop__component__manager__editProcessor input").value.length >= 3 &&
            document.querySelector(".body__main__editDesktop__component__manager__editProcessor input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__editDesktop__component__manager__editMotherBoard input").value.length >= 3 &&
            document.querySelector(".body__main__editDesktop__component__manager__editMotherBoard input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__editDesktop__component__manager__editGraphic input").value.length >= 3 &&
            document.querySelector(".body__main__editDesktop__component__manager__editGraphic input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__editDesktop__component__manager__editRam input").value.length >= 3 &&
            document.querySelector(".body__main__editDesktop__component__manager__editRam input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__editDesktop__component__manager__editCooling input").value.length >= 3 &&
            document.querySelector(".body__main__editDesktop__component__manager__editCooling input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__editDesktop__component__manager__editStorage input").value.length >= 3 &&
            document.querySelector(".body__main__editDesktop__component__manager__editStorage input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__editDesktop__component__manager__editPowerSupply input").value.length >= 3 &&
            document.querySelector(".body__main__editDesktop__component__manager__editPowerSupply input").value.length < 100
        ) &&
        (
            document.querySelector(".body__main__editDesktop__component__manager__editOs input").value.length >= 3 &&
            document.querySelector(".body__main__editDesktop__component__manager__editOs input").value.length < 100
        )
    ) return true
    else return false
}

function isValidFormGame() {
    if (
        (
            document.querySelector(".body__main__editDesktop__game__manager__editfortnitehigh input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editfortnitehigh input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editfortniteultra input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editfortniteultra input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editapexhigh input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editapexhigh input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editapexultra input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editapexultra input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editvaloranthigh input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editvaloranthigh input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editvalorantultra input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editvalorantultra input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editcyberpunkhigh input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editcyberpunkhigh input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editcyberpunkultra input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editcyberpunkultra input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editbattlefieldhigh input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editbattlefieldhigh input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editbattlefieldultra input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editbattlefieldultra input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editrainbowsixhigh input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editrainbowsixhigh input").value.length <= 3
        ) &&
        (
            document.querySelector(".body__main__editDesktop__game__manager__editrainbowsixultra input").value.length >= 1 &&
            document.querySelector(".body__main__editDesktop__game__manager__editrainbowsixultra input").value.length <= 3
        )
    ) return true;
    else return false;
}



document.querySelector(".body__main__editDesktop__information__submit button")?.addEventListener("click", function () {
    $(this).text("Traitement en cours ...");
    $(this).prop("disabled", true)
    $.ajax({
        url: `/admin/shop/edit/${$(".desktop_id").val()}/information`,
        type: "POST",
        dataType: "json",
        data: {
            category: $(".body__main__editDesktop__information__manager__selectCategory__select__editCategory").val(),
            title: $(".body__main__editDesktop__information__manager__title input").val(),
            description: $(".body__main__editDesktop__information__manager__description textarea").val(),
            price: $(".body__main__editDesktop__information__manager__price input").val(),
        },
        success: function (data) {
            $(".body__main__editDesktop__information__submit button").text("Valider");
            $(".body__main__editDesktop__information__check").addClass('active')
            document.querySelector(".body__main__editDesktop__information__h2").scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
            setTimeout(() => {
                $(".body__main__editDesktop__information__check").removeClass('active')
            }, 3000)
        },
        error: function (data) {
            $(".body__main__editDesktop__information__submit button").text("Valider");
            let arrayData = JSON.parse(data.responseText)
            for (let i = 0; i < arrayData.length; i++) {
                document.querySelector("." + arrayData[i].class).innerText = arrayData[i].value
            }
            document.querySelector("." + arrayData[0].label).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        }
    })
})

document.querySelector(".body__main__editDesktop__component__manager__submit button")?.addEventListener("click", function () {
    $(this).text("Traitement en cours ...");
    $(this).prop("disabled", true)
    $.ajax({
        url: `/admin/shop/edit/${$(".desktop_id").val()}/component`,
        type: "POST",
        dataType: "json",
        data: {
            case: $(".body__main__editDesktop__component__manager__editCase input").val(),
            processor: $(".body__main__editDesktop__component__manager__editProcessor input").val(),
            motherboard: $(".body__main__editDesktop__component__manager__editMotherBoard input").val(),
            graphic: $(".body__main__editDesktop__component__manager__editGraphic input").val(),
            ram: $(".body__main__editDesktop__component__manager__editRam input").val(),
            cooling: $(".body__main__editDesktop__component__manager__editCooling input").val(),
            storage: $(".body__main__editDesktop__component__manager__editStorage input").val(),
            powerSupply: $(".body__main__editDesktop__component__manager__editPowerSupply input").val(),
            os: $(".body__main__editDesktop__component__manager__editOs input").val()
        },
        success: function (data) {
            $(".body__main__editDesktop__component__manager__submit button").text("Valider");
            $(".body__main__editDesktop__component__check").addClass('active')
            document.querySelector(".body__main__editDesktop__component__h2").scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
            setTimeout(() => {
                $(".body__main__editDesktop__component__check").removeClass('active')
            }, 3000)
        },
        error: function (data) {
            $(".body__main__editDesktop__component__manager__submit button").text("Valider");
            let arrayData = JSON.parse(data.responseText)
            if (arrayData[0].class === "body__main__editDesktop__component__error") {
                $(".body__main__editDesktop__component__error").addClass("active")
                return setTimeout(() => {
                    $(".body__main__editDesktop__component__error").removeClass("active")
                })
            } else for (let i = 0; i < arrayData.length; i++) {
                document.querySelector("." + arrayData[i].class).innerText = arrayData[i].value
            }
            document.querySelector("." + arrayData[0].label).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        }
    })
})

document.querySelector(".body__main__editDesktop__game__manager__submit button")?.addEventListener("click", function () {
    $(this).text("Traitement en cours ...");
    $(this).prop("disabled", true)
    $.ajax({
        url: `/admin/shop/edit/${$(".desktop_id").val()}/game`,
        type: "POST",
        dataType: "json",
        data: {
            fortniteHigh: $(".body__main__editDesktop__game__manager__editfortnitehigh input").val(),
            fortniteUltra: $(".body__main__editDesktop__game__manager__editfortniteultra input").val(),
            apexHigh: $(".body__main__editDesktop__game__manager__editapexhigh input").val(),
            apexUltra: $(".body__main__editDesktop__game__manager__editapexultra input").val(),
            valorantHigh: $(".body__main__editDesktop__game__manager__editvaloranthigh input").val(),
            valorantUltra: $(".body__main__editDesktop__game__manager__editvalorantultra input").val(),
            cyberpunkHigh: $(".body__main__editDesktop__game__manager__editcyberpunkhigh input").val(),
            cyberpunkUltra: $(".body__main__editDesktop__game__manager__editcyberpunkultra input").val(),
            battlefieldHigh: $(".body__main__editDesktop__game__manager__editbattlefieldhigh input").val(),
            battlefieldUltra: $(".body__main__editDesktop__game__manager__editbattlefieldultra input").val(),
            rainbowsixHigh: $(".body__main__editDesktop__game__manager__editrainbowsixhigh input").val(),
            rainbowsixUltra: $(".body__main__editDesktop__game__manager__editrainbowsixultra input").val()
        },
        success: function (data) {
            $(".body__main__editDesktop__game__manager__submit button").text("Valider");
            $(".body__main__editDesktop__game__check").addClass('active')
            document.querySelector(".body__main__editDesktop__game__h2").scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
            setTimeout(() => {
                $(".body__main__editDesktop__game__check").removeClass('active')
            }, 3000)
        },
        error: function (data) {
            $(".body__main__editDesktop__game__manager__submit button").text("Valider");
            let arrayData = JSON.parse(data.responseText)
            if (arrayData[0].class === "body__main__editDesktop__game__error") {
                $(".body__main__editDesktop__game__error").addClass("active")
                return setTimeout(() => {
                    $(".body__main__editDesktop__game__error").removeClass("active")
                })
            } else for (let i = 0; i < arrayData.length; i++) {
                document.querySelector("." + arrayData[i].small).innerText = arrayData[i].value
            }
            document.querySelector("." + arrayData[0].label).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        }
    })
})

document.querySelector(".body__main__deleteDesktop").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment supprimer l'ordinateur ?")) {
        $.ajax({
            url: `/admin/shop/edit/${$(".desktop_id").val()}/delete`,
            type: "POST",
            dataType: "json",
            data: {},
            success: function (data) {
                alert("L'ordinateur a bien été supprimé !")
                location.replace('/admin/shop')
            },
            error: function (data) {
                alert("Une erreur vient se produire, veuillez ressayer ultrérieurement")
            }
        })
    }
})