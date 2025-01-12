document.addEventListener("DOMContentLoaded", function () {
    const toggleContent = (event) => {
        const targetId = event.target.getAttribute("data-target");
        const targetContent = document.getElementById(targetId);
        const allContents = document.querySelectorAll(".project-txt-and-img");

        allContents.forEach(content => {
            if (content !== targetContent) {
                content.style.display = "none";
            }
        });

        if (targetContent.style.display === "flex") {
            targetContent.style.display = "none";
        } else {
            targetContent.style.display = "flex";
        }
    };

    const clickableWords = document.querySelectorAll(".clickable-word");
    clickableWords.forEach(word => {
        word.addEventListener("click", toggleContent);
    });
});