// document.addEventListener('DOMContentLoaded', function () {
//     let placeholderFilter = document.querySelector(".body__main__findCommand__findByCategory__placeholder")
//     let contentFilter = document.querySelector(".body__main__findCommand__findByCategory__select")
//     let arrowFilter = document.querySelector(".body__main__findCommand__findByCategory__placeholder i")

//     document?.addEventListener('click', function (event) {
//         if (contentFilter?.classList?.contains('active') && !contentFilter?.contains(event.target)) {
//             placeholderFilter?.classList?.toggle("active")
//             contentFilter?.classList?.toggle("active")
//             arrowFilter?.classList?.toggle("active")
//         }
//     });

//     placeholderFilter?.addEventListener("click", (event) => {
//         event.stopPropagation()
//         placeholderFilter?.classList?.toggle("active")
//         contentFilter?.classList?.toggle("active")
//         arrowFilter?.classList?.toggle("active")
//     })


//     document.querySelectorAll(".body__main__popup__content__form__selectCategory__select span").forEach((container) => {
//         container.addEventListener("click", () => {
//             document.querySelector(".body__main__popup__content__form__selectCategory__placeholder__content p").innerText = container.innerText
//             document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value = container.getAttribute("aria-value")
//             placeholderCateogry?.classList?.toggle("active")
//             contentCategory?.classList?.toggle("active")
//             arrowCategory?.classList?.toggle("active")
//             document.querySelector(`.small__form__category`).innerHTML = ''
//             if (isValidForm()) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
//             else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
//         })
//     })
// })

$(document).on("input", 'input[name="findCommand"]', function (eventInput) {
    if ($(this).val().length > 0) {
        $.ajax({
            url: `/admin/command/manage/${$(this).val()}/search`,
            type: "POST",
            dataType: "json",
            data: {},
            success: function (data) {
                const arrayCommandActive = data.commandActive;
                $('.body__main__commands').html("");
                if ($(".body__main__anyCommand").hasClass("active")) $(".body__main__anyCommand").removeClass("active");
                console.log(arrayCommandActive);
                // for (let i = 0; i < arrayCommandActive.length; i++) {
                //     let sectionCommand = document.createElement("a");
                //     sectionCommand.className = "body__main__commands__container";
                //     sectionCommand.href = "/admin/command/manage/" + arrayCommandActive[i].id
                //     sectionCommand.innerHTML = `
                //     <div class="body__main__users__container__icon">
                //     <i class="fa-solid fa-circle-user"></i>
                //     </div>
                //     <div class="body__main__users__container__content">
                //     <p class="body__main__users__container__content__title">${arrayAccount[i].email}</p>
                //     <p>
                //     Prénom: ${arrayAccount[i].name}<br>
                //     Nom: ${arrayAccount[i].surname}<br>
                //     Rôle du compte: ${arrayAccount[i].role}<br>
                //     Compte créer le: ${arrayAccount[i].create_time}<br>
                //     </p>
                //     </div>
                //     <div class="body__main__users__container__action">
                //     <a href="/admin/user?id=${arrayAccount[i].account_id}">Modifier</a>
                //     </div>
                //     `;
                //     $('.body__main__users').append(section);
                // }
            },
            error: function (xhr, status, error) {
                $('.body__main__users').html("");
                if (!$(".body__main__anyCommand").hasClass("active")) $(".body__main__anyAccount").addClass("active");
            }
        });
    } else location.reload();
});