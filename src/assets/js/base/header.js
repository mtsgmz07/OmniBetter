document.addEventListener('DOMContentLoaded', function () {
    let navBurger = document.querySelector(".header__nav__burger");
    let menu = document.querySelector("menu");
    let body = document.querySelector("body");

    document.addEventListener('click', function (event) {
        if (menu.classList.contains('active') && !menu.contains(event.target)) {
            navBurger.classList.remove("active");
            menu.classList.remove("active");
            body.classList.remove("active");
        }
    });

    navBurger.addEventListener("click", (event) => {
        event.stopPropagation()
        navBurger.classList.toggle("active");
        menu.classList.toggle("active");
        body.classList.toggle("active");
    });
});
