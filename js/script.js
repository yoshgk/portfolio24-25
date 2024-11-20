document.addEventListener("DOMContentLoaded", function () {
    const projectsButton = document.getElementById("projects-button");
    const projectsDropdown = document.getElementById("project-dropdown");

    function showDropdown() {
        projectsDropdown.style.display = "block";
    }

    function hideDropdown() {
        setTimeout(function () {
            if (!projectsDropdown.matches(':hover')) {
                projectsDropdown.style.display = "none";
            }
        }, 50);
    }

    function hideDropdownImmediately() {
        projectsDropdown.style.display = "none";
    }

    projectsButton.addEventListener("mouseenter", showDropdown);
    projectsDropdown.addEventListener("mouseenter", showDropdown);
    projectsButton.addEventListener("mouseleave", hideDropdown);
    projectsDropdown.addEventListener("mouseleave", hideDropdownImmediately);
});

document.addEventListener("DOMContentLoaded", function () {
    const learningOutcomeItems = document.querySelectorAll(".learning-outcomes li");
    const contentSections = document.querySelectorAll(".lo-content");

    function handleLearningOutcomeClick(event) {
        learningOutcomeItems.forEach(function (lo) {
            lo.classList.remove("active");
        });

        contentSections.forEach(function (section) {
            section.classList.remove("active");
        });

        event.target.classList.add("active");

        const loId = event.target.getAttribute("data-lo");
        document.getElementById(loId).classList.add("active");
    }

    learningOutcomeItems.forEach(function (item) {
        item.addEventListener("click", handleLearningOutcomeClick);
    });
});