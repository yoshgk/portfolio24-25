document.addEventListener("DOMContentLoaded", () => {
    const projectsButton = document.getElementById("projects-button");
    const projectDropdown = document.getElementById("project-dropdown");

    projectsButton.addEventListener("mouseenter", () => {
        projectDropdown.style.display = "block";
    });

    projectDropdown.addEventListener("mouseenter", () => {
        projectDropdown.style.display = "block";
    });
    projectsButton.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (!projectDropdown.matches(':hover')) {
                projectDropdown.style.display = "none";
            }
        }, 50);
    });

    projectDropdown.addEventListener("mouseleave", () => {
        projectDropdown.style.display = "none"; 
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const learningOutcomeItems = document.querySelectorAll(".learning-outcomes li");
    const contentSections = document.querySelectorAll(".lo-content");

    learningOutcomeItems.forEach(item => {
        item.addEventListener("click", () => {
            learningOutcomeItems.forEach(lo => lo.classList.remove("active"));
            contentSections.forEach(section => section.classList.remove("active"));

            item.classList.add("active");
            const loId = item.getAttribute("data-lo");
            document.getElementById(loId).classList.add("active");
        });
    });
});