document.addEventListener("DOMContentLoaded", () => {
    const projectsButton = document.getElementById("projects-button");
    const projectDropdown = document.getElementById("project-dropdown");

    // Show dropdown when "Projects" is hovered
    projectsButton.addEventListener("mouseenter", () => {
        projectDropdown.style.display = "block"; // Make the dropdown visible
    });

    // Keep dropdown visible when hovered
    projectDropdown.addEventListener("mouseenter", () => {
        projectDropdown.style.display = "block"; // Keep it visible
    });

    // Hide dropdown when mouse leaves both "Projects" and the dropdown
    projectsButton.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (!projectDropdown.matches(':hover')) {
                projectDropdown.style.display = "none";
            }
        }, 50); // Add slight delay to allow hover transition
    });

    projectDropdown.addEventListener("mouseleave", () => {
        projectDropdown.style.display = "none"; // Hide dropdown
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