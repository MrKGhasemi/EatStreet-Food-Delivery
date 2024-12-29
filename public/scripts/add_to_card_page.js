const sum_of_a_product_elements =
  document.querySelectorAll(".sum_of_a_product");
const update_quantity_buttons = document.querySelectorAll(
  ".update_quantity_button"
);
const cardsSpan = document.querySelectorAll("#number_of_user_added_to_cards");
const list_each_product = document.querySelectorAll(".list_each_product");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function updates_to_db(event) {
  event.preventDefault();
  console.log("Update button clicked");

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const UpdateForm = event.target.closest("form");
  const url = UpdateForm.getAttribute("action");

  const listItem = event.target.closest(".list_each_product");
  const quantity_input = listItem.querySelector(".quantity_input");
  const quantity = parseFloat(quantity_input.value);

  const f_url = url + "/" + quantity + "/updated";

  fetch(f_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "csrf-token": csrfToken,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .then((data) => {
      // Update the number of cards in the header
      for (let i = 0; i < cardsSpan.length; i++) {
        cardsSpan[i].textContent = data.cardsCount;
      }

      console.log("Total updated successfully.");
      location.reload();

      // Update the input value
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
update_quantity_buttons.forEach((button) => {
  button.addEventListener("click", updates_to_db);
});
