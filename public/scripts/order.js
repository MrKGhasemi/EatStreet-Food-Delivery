document.addEventListener("DOMContentLoaded", () => {
  // Timer logic
  const timers = document.querySelectorAll(".timer");
  const states = document.querySelectorAll(".state");
  const comment_sections = document.querySelectorAll("#comment_section");

  timers.forEach((timer, index) => {
    const endTime = parseInt(timer.dataset.endTime, 10);
    const state = states[index]?.textContent || "";

    const updateTimer = () => {
      const currentTime = Date.now();
      const remaining = Math.max(0, endTime - currentTime);

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      timer.textContent = `Estimated Delivery: ${minutes}m ${seconds}s`;
    };

    // Declare the interval variable here to avoid scoping issues
    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Run the function immediately to set the initial timer value
  });
  comment_sections.forEach((commentSection, index) => {
    const state = states[index]?.textContent.trim().toLowerCase();
    if (state !== "delivered") {
      commentSection.style.display = "none";
    }
  });

  // Display comments correctly
  const commentSections = document.querySelectorAll(".list_each_product");
  commentSections.forEach((section) => {
    const state = section
      .querySelector(".state")
      ?.textContent.trim()
      .toLowerCase();
    const commentSection = section.querySelector("#comment_section");
    if (state === "delivered" && commentSection) {
      commentSection.style.display = "block";
    } else if (commentSection) {
      commentSection.style.display = "none";
    }
  });

  // Tab switching logic
  const deliveredTab = document.getElementById("deliveredTab");
  const ongoingTab = document.getElementById("ongoingTab");
  const canceledTab = document.getElementById("canceledTab");

  const deliveredSection = document.getElementById("deliveredSection");
  const ongoingSection = document.getElementById("ongoingSection");
  const canceledSection = document.getElementById("CanceledSection");

  // Debugging: Ensure elements are selected
  console.log(deliveredTab, ongoingTab, canceledTab);
  console.log(deliveredSection, ongoingSection, canceledSection);

  // Add event listeners for tab clicks
  deliveredTab.addEventListener("click", () => {
    deliveredSection.classList.remove("hidden");
    ongoingSection.classList.add("hidden");
    canceledSection.classList.add("hidden");
    deliveredTab.classList.add("active");
    ongoingTab.classList.remove("active");
    canceledTab.classList.remove("active");
  });

  ongoingTab.addEventListener("click", () => {
    ongoingSection.classList.remove("hidden");
    deliveredSection.classList.add("hidden");
    canceledSection.classList.add("hidden");
    ongoingTab.classList.add("active");
    deliveredTab.classList.remove("active");
    canceledTab.classList.remove("active");
  });

  canceledTab.addEventListener("click", () => {
    canceledSection.classList.remove("hidden");
    ongoingSection.classList.add("hidden");
    deliveredSection.classList.add("hidden");
    canceledTab.classList.add("active");
    ongoingTab.classList.remove("active");
    deliveredTab.classList.remove("active");
  });

  // Star rating logic
  const starsContainer = document.getElementById("rating_stars");
  if (starsContainer) {
    starsContainer.addEventListener("change", (event) => {
      const selectedStar = event.target;
      if (selectedStar.checked) {
        const allStars = document.querySelectorAll(".star");
        allStars.forEach((star) => (star.style.color = "#ced4da"));

        let current = selectedStar.nextElementSibling;
        while (current) {
          current.style.color = "#ffc107";
          current = current.previousElementSibling;
        }
      }
    });
  }
});
