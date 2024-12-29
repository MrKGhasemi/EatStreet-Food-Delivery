document.addEventListener("DOMContentLoaded", function () {
  const hamburgerButton = document.getElementById("hamburger");
  const mobileHeader = document.getElementById("mobile_header");
  const mobileNavContainer = document.getElementById("mobileNavContainer");
  const navList = document.querySelector(".nav-list"); // Select the navigation list
  const logo_admin = document.getElementById("logo_admin");

  hamburgerButton.addEventListener("click", function () {
    mobileHeader.classList.toggle("active");
    mobileNavContainer.classList.toggle("hidden");
    navList.classList.toggle("active");
    logo_admin.style.display = "none";
  });
});
