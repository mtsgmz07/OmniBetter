function select() {

    let placeholderFilter = document.querySelector(".body__main__path__findClient__findByRole__placeholder")
    let contentFilter = document.querySelector(".body__main__path__findClient__findByRole__select")
    let arrowFilter = document.querySelector(".body__main__path__findClient__findByRole__placeholder i")

    let placeholderEditRole = document.querySelector(".body__main__popup__content__form__selectRole__placeholder")
    let contentEditRole = document.querySelector(".body__main__popup__content__form__selectRole__select")
    let arrowEditRole = document.querySelector(".body__main__popup__content__form__selectRole__placeholder i")

    if (placeholderFilter?.classList.contains('disabled')) return

    document?.addEventListener('click', function (event) {
        if (contentEditRole?.classList?.contains('active') && !contentEditRole?.contains(event.target)) {
            placeholderEditRole?.classList?.toggle("active")
            contentEditRole?.classList?.toggle("active")
            arrowEditRole?.classList?.toggle("active")
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

    placeholderEditRole?.addEventListener("click", (event) => {
        event.stopPropagation()
        placeholderEditRole?.classList?.toggle("active")
        contentEditRole?.classList?.toggle("active")
        arrowEditRole?.classList?.toggle("active")
    })

    document.querySelectorAll(".body__main__popup__content__form__selectRole__select")
        .forEach((container) => {
            container.addEventListener("click", (event) => {
                document.querySelector(".body__main__popup__content__form__selectRole__placeholder p").innerText = event.target.innerText
                document.querySelector(".body__main__popup__content__form__selectRole__inputValue").value = event.target.getAttribute("aria-value")
                placeholderEditRole?.classList?.toggle("active")
                contentEditRole?.classList?.toggle("active")
                arrowEditRole?.classList?.toggle("active")
                document.querySelector(".body__main__popup__content__form__submit input").disabled = false
            })
        })

    if ($('.body__main__users').html()?.trim()?.replace(" ", "") === "") {
        if (!$(".body__main__anyAccount").hasClass("active")) $(".body__main__anyAccount").addClass("active");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    select()
    checkFormPopup()
})

$(document).on("input", 'input[name="findClient"]', function (eventInput) {
    if ($(this).val().length > 0) {
        $.ajax({
            url: "/admin/user",
            type: "POST",
            dataType: "json",
            data: { search: $(this).val() },
            success: function (data) {
                const arrayAccount = data.account;
                $('.body__main__users').html("");
                if ($(".body__main__anyAccount").hasClass("active")) $(".body__main__anyAccount").removeClass("active");
                for (let i = 0; i < arrayAccount.length; i++) {
                    let section = document.createElement("section");
                    section.className = "body__main__users__container";
                    section.innerHTML = `
                    <div class="body__main__users__container__icon">
                    <i class="fa-solid fa-circle-user"></i>
                    </div>
                    <div class="body__main__users__container__content">
                    <p class="body__main__users__container__content__title">${arrayAccount[i].email}</p>
                    <p>
                    Prénom: ${arrayAccount[i].name}<br>
                    Nom: ${arrayAccount[i].surname}<br>
                    Rôle du compte: ${arrayAccount[i].role}<br>
                    Compte créer le: ${arrayAccount[i].create_time}<br>
                    </p>
                    </div>
                    <div class="body__main__users__container__action">
                    <a href="/admin/user?id=${arrayAccount[i].account_id}">Modifier</a>
                    </div>
                    `;
                    $('.body__main__users').append(section);
                }
            },
            error: function (xhr, status, error) {
                $('.body__main__users').html("");
                if (!$(".body__main__anyAccount").hasClass("active")) $(".body__main__anyAccount").addClass("active");
            }
        });
    } else location.reload();
});


$(".body__main__popup__content__form__password__inputPassword i").on("click", function (event) {
    var inputPassword = $(".body__main__popup__content__form__password__inputPassword input");
    if (inputPassword.attr("type") === "password") {
        $(this).removeClass().addClass("fa-solid fa-eye");
        inputPassword.attr("type", "text");
    } else {
        $(this).removeClass().addClass("fa-solid fa-eye-slash");
        inputPassword.attr("type", "password");
    }
});

$(".body__main__popup__content__form__retypePassword__inputPassword i").on("click", function (event) {
    var inputPassword = $(".body__main__popup__content__form__retypePassword__inputPassword input");
    if (inputPassword.attr("type") === "password") {
        $(this).removeClass().addClass("fa-solid fa-eye");
        inputPassword.attr("type", "text");
    } else {
        $(this).removeClass().addClass("fa-solid fa-eye-slash");
        inputPassword.attr("type", "password");
    }
});

document.querySelectorAll(".body__main__user__manageUser__manager").forEach((container) => {
    container.addEventListener("click", (event) => {
        if (["editEmail", "editPassword", "editRole"].includes(event.target.getAttribute("aria-value"))) {
            $.ajax({
                url: "/admin/user",
                type: "POST",
                dataType: "HTML",
                data: {
                    accountId: $(".body__main__accountId").val(),
                    popup: event.target.getAttribute("aria-value")
                },
                success: function (data) {
                    $("body").html(data)
                    select()
                    checkFormPopup()
                },
                error: function (xhr, status, error) {
                    location.replace("/admin/user")
                }
            });
        } else if (event.target.getAttribute("aria-value") === "deleteAccount") {
            confirm("Voulez-vous vraiment supprimer le compte ?")
            $.ajax({
                url: `/admin/user/delete/${$(".body__main__accountId").val()}`,
                type: "POST",
                statusCode: {
                    200: function() {
                        alert("Compte supprimer avec succès !")
                        location.replace("/admin/user")
                    },
                    404: function () {
                        alert("Une erreur vient de se produire, veuillez ressayer ultérieurement.")
                        location.replace("/admin/user")
                    }
                }
            });
        }
    })
})

function checkFormPopup() {
    const getForm = document.querySelector(".body__main__popup__content__form").classList[1]
    document.addEventListener("input", (inputEvent) => {
        switch (getForm) {
            case "editEmail":
                if (inputEvent.target.name === "inputNewEmail" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(inputEvent.target.value)) {
                    document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = 'Adresse e-mail invalide'
                } else if (inputEvent.target.name === "inputNewEmail") {
                    document.querySelector(`.small__form__${inputEvent.target.name}`).innerHTML = ''
                }

                if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(document.querySelector(".body__main__popup__content__form__email input").value)) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
                else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
                break
            case "editPassword":
                if (
                    inputEvent.target.name === "inputNewPassword" &&
                    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(inputEvent.target.value)
                ) {
                    document.querySelector(`.small__form__inputNewPassword`).innerHTML = 'Votre mot de passe doit contenir 8 caractères, 1 majuscule, 1 miniscule et 1 chiffre'
                } else if (inputEvent.target.name === "inputNewPassword") {
                    if (document.querySelector(".body__main__popup__content__form__retypePassword__inputPassword input").value === inputEvent.target.value) {
                        document.querySelector(`.small__form__inputRetypePassword`).innerHTML = ''
                    } else {
                        document.querySelector(`.small__form__inputRetypePassword`).innerHTML = 'Les mots de passe ne sont pas identiques'
                    }
                    document.querySelector(`.small__form__inputNewPassword`).innerHTML = ''
                }

                if (
                    inputEvent.target.name === "inputRetypePassword" &&
                    inputEvent.target.value !== document.querySelector(".body__main__popup__content__form__password__inputPassword input").value
                ) {
                    document.querySelector(`.small__form__inputRetypePassword`).innerHTML = 'Les mots de passe ne sont pas identiques'
                } else if (inputEvent.target.name === "inputRetypePassword") {
                    document.querySelector(`.small__form__inputRetypePassword`).innerHTML = ''
                }

                if (
                    (
                        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(document.querySelector(".body__main__popup__content__form__password__inputPassword input").value)
                    )
                    &&
                    (
                        document.querySelector(".body__main__popup__content__form__password__inputPassword input").value === document.querySelector(".body__main__popup__content__form__retypePassword__inputPassword input").value
                    )
                ) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
                else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
                break
        }
    })
}