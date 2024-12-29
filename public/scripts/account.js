document.addEventListener("DOMContentLoaded", () => {
  // Tab switching logic
  const EmailTab = document.getElementById("emailTab");
  const PasswordTab = document.getElementById("passwordTab");
  const AddressTab = document.getElementById("addressTab");

  const EmailSection = document.getElementById("emailSection");
  const PasswordSection = document.getElementById("passwordSection");
  const AddressSection = document.getElementById("addressSection");

  // Debugging: Ensure elements are selected
  console.log(EmailTab, PasswordTab, AddressTab);
  console.log(EmailSection, PasswordSection, AddressSection);

  // Add event listeners for tab clicks
  EmailTab.addEventListener("click", () => {
    EmailSection.classList.remove("hidden");
    PasswordSection.classList.add("hidden");
    AddressSection.classList.add("hidden");
    EmailTab.classList.add("active");
    PasswordTab.classList.remove("active");
    AddressTab.classList.remove("active");
  });

  PasswordTab.addEventListener("click", () => {
    PasswordSection.classList.remove("hidden");
    EmailSection.classList.add("hidden");
    AddressSection.classList.add("hidden");
    PasswordTab.classList.add("active");
    EmailTab.classList.remove("active");
    AddressTab.classList.remove("active");
  });

  AddressTab.addEventListener("click", () => {
    AddressSection.classList.remove("hidden");
    PasswordSection.classList.add("hidden");
    EmailSection.classList.add("hidden");
    AddressTab.classList.add("active");
    PasswordTab.classList.remove("active");
    EmailTab.classList.remove("active");
  });
});
