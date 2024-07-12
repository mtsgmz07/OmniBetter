$(".body__main__delete__action").click(() => {
    $.ajax({
        url: window.location.pathname,
        type: "POST",
        dataType: "html",
    })
    .done(response => {
        $("body").html(response)
        setTimeout(() => {
            window.location = "/"
        }, 3000)
    })
    .fail((xhr, status, error) => {
        console.error("Erreur lors de la requête AJAX :", status, error);
    });
})
