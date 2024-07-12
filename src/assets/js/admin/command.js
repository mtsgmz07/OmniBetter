document.addEventListener('DOMContentLoaded', function () {
    let placeholderFilter = document.querySelector(".body__main__findCommand__findByCategory__placeholder")
    let contentFilter = document.querySelector(".body__main__findCommand__findByCategory__select")
    let arrowFilter = document.querySelector(".body__main__findCommand__findByCategory__placeholder i")

    document?.addEventListener('click', function (event) {
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


    document.querySelectorAll(".body__main__popup__content__form__selectCategory__select span").forEach((container) => {
        container.addEventListener("click", () => {
            document.querySelector(".body__main__popup__content__form__selectCategory__placeholder__content p").innerText = container.innerText
            document.querySelector(".body__main__popup__content__form__selectCategory__inputHidden").value = container.getAttribute("aria-value")
            placeholderCateogry?.classList?.toggle("active")
            contentCategory?.classList?.toggle("active")
            arrowCategory?.classList?.toggle("active")
            document.querySelector(`.small__form__category`).innerHTML = ''
            if (isValidForm()) document.querySelector(".body__main__popup__content__form__submit input").disabled = false
            else document.querySelector(".body__main__popup__content__form__submit input").disabled = true
        })
    })
})

$.ajax({
    url: "/basket/invoice/" + document.querySelector(".paymentId").value + "/download",
    type: "POST",
    dataType: "json",
    data: {},
    success: function (data) {
        $(".body__main__actions__manager__invoice").removeClass("disabled")
        $(".body__main__actions__manager__invoice").attr("href", data.file)
        $(".body__main__actions__manager__invoice").text("Imprimer la preuve d'achat")
    },
    error: function (xhr, status, error) {
        $(".body__main__actions__manager__invoice")[index].text("Facture indisponible")
    }
});

document.querySelector(".body__main__actions__manager__delete").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment supprimer la commande ?")) {
        const reason = prompt("Pourquoi voulez-vous supprimer la commande ?")
        if (!reason) return
        $.ajax({
            url: "/admin/command/manage/" + document.querySelector(".paymentId").value + "/delete",
            type: "POST",
            dataType: "json",
            data: { reason },
            success: function (data) {
                alert("La commande a bien été supprimée")
                location.replace("/admin/command/active")
            },
            error: function (xhr, status, error) {
                alert("Une erreur vient se survenir, veuillez ressayer ultérieurement")
            }
        });
    }
})
