document.addEventListener("DOMContentLoaded", function() {
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(accordion => {
        accordion.addEventListener("click", function() {
            // Alterna a classe "active" para a cor e estilo do botão
            this.classList.toggle("active");

            // Alterna a exibição do painel
            const panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    });
});
