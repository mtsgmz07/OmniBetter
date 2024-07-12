document.querySelectorAll(".body__main__faq__manager__container")
    .forEach((container, index) => {
        container.addEventListener("click", () => {
            if (!container.classList.contains('active')) {
                document.querySelectorAll(".fa-circle-plus")[index].style.display = "none"
                document.querySelectorAll(".fa-circle-minus")[index].style.display = "block"
                container.classList.add("active")
                document.querySelectorAll(".body__main__faq__manager__container__value")[index].classList.add("active")
            } else {
                document.querySelectorAll(".fa-circle-plus")[index].style.display = "block"
                document.querySelectorAll(".fa-circle-minus")[index].style.display = "none"
                container.classList.remove("active")
                document.querySelectorAll(".body__main__faq__manager__container__value")[index].classList.remove("active")
            }
        })
    })

function initializeSwiper(selector, paginationSelector, callback) {
    new Swiper(selector, {
        pagination: {
            el: paginationSelector,
        },
        slidesPerView: "auto",
        spaceBetween: 30,
        on: {
            init: function () {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }
    });
}

function handleSwiper() {
    const isMobile = window.innerWidth <= 600;

    const bestsellerSwiperSelector = ".swiperBestseller";
    const bestsellerManagerSelector = ".body__main__bestseller__manager";
    const bestsellerContainerSelector = ".body__main__bestseller__manager__container";
    const bestsellerPaginationSelector = ".swiper-paginationBestseller";

    const officeComputerSwiperSelector = ".swiperGamingComputer";
    const officeComputerManagerSelector = ".body__main__gamingComputer__manager";
    const officeComputerContainerSelector = ".body__main__gamingComputer__manager__container";
    const officeComputerPaginationSelector = ".swiper-paginationGamingComputer";

    if (isMobile) {
        document.querySelector(bestsellerSwiperSelector).classList.add("swiper");
        document.querySelector(bestsellerManagerSelector).classList.add("swiper-wrapper");
        document.querySelectorAll(bestsellerContainerSelector).forEach(container => {
            container.classList.add("swiper-slide");
        });

        initializeSwiper(bestsellerSwiperSelector, bestsellerPaginationSelector, function () {
            document.querySelector(officeComputerSwiperSelector).classList.add("swiper");
            document.querySelector(officeComputerManagerSelector).classList.add("swiper-wrapper");
            document.querySelectorAll(officeComputerContainerSelector).forEach(container => {
                container.classList.add("swiper-slide");
            });

            initializeSwiper(officeComputerSwiperSelector, officeComputerPaginationSelector);
        });
    } else {
        [bestsellerSwiperSelector, officeComputerSwiperSelector].forEach(selector => {
            document.querySelector(selector).classList.remove("swiper");
        });

        [bestsellerManagerSelector, officeComputerManagerSelector].forEach(selector => {
            document.querySelector(selector).classList.remove("swiper-wrapper");
        });

        [bestsellerContainerSelector, officeComputerContainerSelector].forEach(selector => {
            document.querySelectorAll(selector).forEach(container => {
                container.classList.remove("swiper-slide");
                container.style = '';
            });
        });
    }
}

window.addEventListener('resize', function () {
    handleSwiper();
});

handleSwiper();




