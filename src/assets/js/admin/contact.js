document.addEventListener("input", () => {
    if (document.querySelector('.body__main__response__admin__form__response textarea').value.length > 0) document.querySelector(".body__main__response__admin__form__submit input").disabled = false
    else document.querySelector(".body__main__response__admin__form__submit input").disabled = true
})

$(".body__main__response__admin__form__delete__firstAction").click(function (event) {
    $(this).hide();
    $(".body__main__response__admin__form__delete__action").css("display", "flex");
});

$(".body__main__response__admin__form__delete__action__cancel").click(function (event) {
    $(".body__main__response__admin__form__delete__action").hide();
    $(".body__main__response__admin__form__delete__firstAction").css("display", "block");
});

$(".body__main__response__admin__form__delete__action__confirm").click(function () {
    $.ajax({
        url: `/admin/contact/delete/${$(".body__main__response__admin__form__contactId").val()}`,
        type: "POST",
        dataType: "json",
        statusCode: {
            200: function() {
                $(".body__main__response__admin__form__delete__action").hide();
                $(".body__main__response__admin__form__delete__result").addClass("check")
                $(".body__main__response__admin__form__delete__result").text("Formulaire de contact supprimé, redirection dans 2 secondes");
                setTimeout(() => {
                    location.replace("/admin/contact")
                }, 2000)
            },
            404: function (err) {
                $(".body__main__response__admin__form__delete__firstAction").css("display", "block");
                $(".body__main__response__admin__form__delete__action").hide();
                $(".body__main__response__admin__form__delete__result").addClass("error")
                $(".body__main__response__admin__form__delete__result").text("Une erreur s'est produite");
                setTimeout(() => {
                    $(".body__main__response__admin__form__delete__result").removeClass("error")
                    $(".body__main__response__admin__form__delete__result").text("");
                }, 2000)
            }
        }
    });
});
