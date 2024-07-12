const form = document.querySelector('form');
const inputs = form.querySelectorAll('input');
const KEYBOARDS = {
    backspace: 8,
    arrowLeft: 37,
    arrowRight: 39,
};

function handleInput(e) {
    const input = e.target;
    const nextInput = input.nextElementSibling;
    if (nextInput && input.value) {
        nextInput.focus();
        if (nextInput.value) {
            nextInput.select();
        }
    }
}

function handlePaste(e) {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    inputs.forEach((input, i) => {
        if (input.name === "verificationId") return
        input.value = paste[i] || '';
    });
}

function handleBackspace(e) {
    const input = e.target;
    if (input.value) {
        if (input.name === "verificationId") return
        input.value = '';
        return;
    }

    const previousInput = input.previousElementSibling;
    if (previousInput) {
        previousInput.focus();
    }
}

function handleArrowLeft(e) {
    const previousInput = e.target.previousElementSibling;
    if (previousInput) {
        previousInput.focus();
    }
}

function handleArrowRight(e) {
    const nextInput = e.target.nextElementSibling;
    if (nextInput) {
        nextInput.focus();
    }
}

form.addEventListener('input', handleInput);
form.addEventListener('paste', (e) => {
    handlePaste(e);
    handleInputChange();
});

inputs.forEach((input) => {
    input.addEventListener('focus', (e) => {
        setTimeout(() => {
            e.target.select();
        }, 0);
    });

    input.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
            case KEYBOARDS.backspace:
                handleBackspace(e);
                break;
            case KEYBOARDS.arrowLeft:
                handleArrowLeft(e);
                break;
            case KEYBOARDS.arrowRight:
                handleArrowRight(e);
                break;
            default:
        }
    });
});

document.addEventListener('input', handleInputChange);

function handleInputChange() {
    const inputFields = document.querySelectorAll('.body__main__verification__rigth__form__input input');

    const allFieldsFilled = Array.from(inputFields).every((input) => input.value.length > 0);

    inputFields.forEach((input) => {
        if (allFieldsFilled || input.value.length > 0) {
            input.style.border = "1px solid var(--orange)";
        } else {
            input.style.border = "1px solid #00000033";
            $(".body__main__verification__rigth__form__p").text("Entrer votre code ci-dessus");
        }
    });

    if (allFieldsFilled) {
        let formattedContent = '';
        inputFields.forEach((input) => {
            formattedContent += `${input.value}`;
        });
        $(".body__main__loading").addClass("active")
        $.ajax({
            url: `/verification`,
            type: "POST",
            dataType: "application/json",
            data: { id: $(".body__main__verification__rigth__form__id").val(), code: formattedContent },
            statusCode: {
                200: function (data) {
                    inputFields.forEach((input) => {
                        input.style.border = "1px solid green";
                        input.disabled = true;
                    });
                    $(".body__main__verification__rigth__form__p").text("Code bon, vous serez automatiquement redirigé dans 3 secondes");
                    setTimeout(() => {
                        window.location = (JSON.parse(data.responseText)).redirect_url;
                    }, 3000);
                },
                404: function () {
                    inputFields.forEach((input) => {
                        input.style.border = "1px solid red";
                    });
                    $(".body__main__loading").removeClass("active")
                    $(".body__main__verification__rigth__form__p").text("Code invalide, veuillez ressayer");
                }
            }
        });
    }
}

$(".body__main__verification__left__span").click(() => {
    $.ajax({
        url: `/verification/send/${$(".body__main__verification__rigth__form__id").val()}`,
        type: "POST",
        dataType: "html",
    })
        .done(response => {
            $(".body__main__verification__left__response").css("display", "block");
            setTimeout(() => {
                $(".body__main__verification__left__response").css("display", "none");
            }, 3000)
        })
        .fail((xhr, status, error) => {
            if (!$(".body__main__verification__left__span").hasClass("disabled")) {
                $(".body__main__verification__left__span").addClass("disabled");
            }
            console.error("Erreur lors de la requête AJAX :", status, error);
        });
})

