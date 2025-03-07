// scripts/modals/modalHandlers.js
import { injectModalContent } from './modalContentInjector.js';

document.addEventListener('DOMContentLoaded', function () {
    const mainFab = document.getElementById('main-fab');
    const fabOptions = document.getElementById('fab-options');

    if (mainFab && fabOptions) {
        mainFab.addEventListener('click', function () {
            fabOptions.classList.toggle('show');
        });

        mainFab.addEventListener('touchstart', function (e) {
            e.preventDefault();
            fabOptions.classList.toggle('show');
        });
    } else {
        console.error('Elementos main-fab ou fab-options não encontrados no DOM.');
    }

    const fabOptionsButtons = document.querySelectorAll(".fab-option");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close");

    modals.forEach(modal => {
        modal.style.display = "none";
    });

    fabOptionsButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetModal = document.getElementById(button.dataset.target);
            if (targetModal) {
                let sourceId, targetId;
                if (button.dataset.target === "clientModal") {
                    sourceId = "client-data-panel";
                    targetId = "clientModalContent";
                } else if (button.dataset.target === "companyModal") {
                    sourceId = "company-data-panel";
                    targetId = "companyModalContent";
                } else if (button.dataset.target === "equipmentModal") {
                    sourceId = "equipments-panel";
                    targetId = "equipmentModalContent";
                } else if (button.dataset.target === "serviceModal") {
                    sourceId = "services-container";
                    targetId = "serviceModalContent";
                }

                injectModalContent(sourceId, targetId);

                setTimeout(() => {
                    targetModal.classList.add("show");
                    targetModal.style.display = "flex";
                }, 0);
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const modal = button.closest(".modal");
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        });

        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("show");
                setTimeout(() => {
                    modal.style.display = "none";
                }, 300);
            }
        });
    });

    const menuHamburger = document.getElementById('menu-hamburger');
    if (menuHamburger) {
        menuHamburger.addEventListener('click', function() {
            const menuLinks = document.getElementById('menu-links');
            menuLinks.classList.toggle('show');
        });

        menuHamburger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const menuLinks = document.getElementById('menu-links');
            menuLinks.classList.toggle('show');
        });
    } else {
        console.error('Elemento menu-hamburger não encontrado no DOM.');
    }
});