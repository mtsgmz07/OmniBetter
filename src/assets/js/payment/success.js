document.addEventListener("DOMContentLoaded", () => {
    $.ajax({
        url: "/basket/invoice/" + $(".paymentId").val() + "/download",
        type: "POST",
        dataType: "json",
        data: {},
        success: function (data) {
            $(".body__main__action__downloadInvoice").removeClass("disabled")
            $(".body__main__action__downloadInvoice").attr("href", data.file)
            $(".body__main__action__downloadInvoice").text("Imprimer la facture")
        },
        error: function (xhr, status, error) {
            $(".body__main__action__downloadInvoice").text("Connectez-vous pour la facture")
        }
    });
})