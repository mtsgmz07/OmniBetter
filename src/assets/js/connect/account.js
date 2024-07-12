$(".deleteAccount").click(() => {
    $.ajax({
        url: `/connect/account/delete`,
        type: "POST",
        dataType: "html",
    })
    .done(response => {
        $("body").html(response)
    })
    .fail((xhr, status, error) => {
        console.error("Erreur lors de la requête AJAX :", status, error);
    });
})

