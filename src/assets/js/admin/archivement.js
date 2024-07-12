document.addEventListener("FilePond:addfile", () => {
    if (filePondInput?.getFiles().length > 0) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
    else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
})

document.addEventListener("FilePond:removefile", () => {
    if (filePondInput?.getFiles().length > 0) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
    else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
})

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
            url: `/admin/archivement`,
            type: "POST",
            dataType: "json",
            data: {
                filepond: base64Strings
            },
            success: function (data) {
                $(".waitRequest").removeClass("active")
                if ($(".body__main__popup__content__error").hasClass("active")) $(".body__main__popup__content__error").removeClassClass("active")
                $(".body__main__popup__content__check").addClass("active")
            },
            error: function (data) {
                $(".waitRequest").removeClass("active")
                $(".body__main__popup__content__form").css("display", "flex")
                $(".body__main__popup__content__error").addClass("active")
            }
        })
    }
})

document.querySelectorAll(".body__main__archivement__manager__container__i").forEach((container, index) => {
    container.addEventListener("click", () => {
        if (confirm("Voulez-vous vraiment supprimer cette réalisation ?")) {
            $.ajax({
                url: `/admin/${document.querySelectorAll(".archivement_id")[index].value}/delete`,
                type: "POST",
                dataType: "json",
                data: {},
                success: function (data) {
                    alert("La réalisation a bien été supprimée !")
                    location.reload()
                },
                error: function (data) {
                    alert("Une erreur vient de survenir, veuillez ressayer ultérieurement")
                }
            })
        }

    })
})