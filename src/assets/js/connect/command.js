document.querySelectorAll(".body__main__commands__container__info__rigth__downloadInvoice").forEach((container, index) => {
    $.ajax({
        url: "/basket/invoice/" + document.querySelectorAll(".paymentId")[index].value + "/download",
        type: "POST",
        dataType: "json",
        data: {},
        success: function (data) {
            $(container).removeClass("disabled")
            $(container).attr("href", data.file)
            $(container).text("Imprimer la preuve d'achat")
        },
        error: function (xhr, status, error) {
            $(container)[index].text("Facture indisponible")
        }
    });
})
