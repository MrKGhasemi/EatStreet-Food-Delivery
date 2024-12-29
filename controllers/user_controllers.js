const ObjectId = require("mongodb").ObjectId;
const input_validation = require("../session/input_Validation");
const db = require("../data/database");
const bcrypt = require("bcryptjs");

function getMainPage(req, res) {
  if (res.locals.isAdmin) {
    res.redirect("/admin");
  } else {
    res.redirect("/restaurants");
  }
}

async function getRestaurantsPage(req, res) {
  const restaurants = await db
    .getDB()
    .collection("restaurants")
    .find()
    .toArray();
  res.render("user/user_restaurants", { restaurants: restaurants });
}

async function getRestaurantDetailPage(req, res) {
  const id = req.params.id;
  const restaurant = await db
    .getDB()
    .collection("restaurants")
    .findOne({ _id: id });
  res.render("user/user_restaurant_detail", { restaurant: restaurant });
}

async function getAccountDetailPage(req, res) {
  const inputUserData = input_validation.session_inputData(req, {
    email: "",
    password: "",
  });
  const user_id = req.session.user.id;
  const user_data = await db
    .getDB()
    .collection("users_data")
    .findOne({ _id: new ObjectId(user_id) });
  res.render("user/user_account", {
    user_data: user_data,
    inputUserData: inputUserData,
  });
}

async function postAccountEmailChange(req, res) {
  const inputUserData = input_validation.session_inputData(req, {
    email: "",
    password: "",
  });
  const user_id = req.params.id;
  const userData = req.body;
  email = userData.email;
  confirm_email = userData.confirm_email;

  const user_data = await db
    .getDB()
    .collection("users_data")
    .findOne({ email: email });

  if (user_data) {
    input_validation.flashErorToSession(
      req,
      {
        massage: "email is already exists",
        email: email,
        confirm_email: confirm_email,
      },
      function () {
        res.redirect("/account");
      }
    );
    return;
  }

  if (
    !input_validation.auth_input_Is_Valid_for_email_change(email, confirm_email)
  ) {
    input_validation.flashErorToSession(
      req,
      {
        massage: "email is incorrect.check your input",
        email: email,
        confirm_email: confirm_email,
      },
      function () {
        res.redirect("/account");
      }
    );
    return;
  }
  await db
    .getDB()
    .collection("users_data")
    .updateOne({ _id: new ObjectId(user_id) }, { $set: { email: email } });

  const user_data2 = await db
    .getDB()
    .collection("users_data")
    .findOne({ _id: new ObjectId(user_id) });

  res.render("user/user_account", {
    user_data: user_data2,
    inputUserData: inputUserData,
  });
}

// async function postAccountPhoneChange(req, res) {
//   const inputUserData = input_validation.session_inputData(req, {
//     email: "",
//     password: "",
//   });
//   const user_id = req.params.id;
//   const userData = req.body;
//   phone = userData.phone;
//   confirm_phone = userData.confirm_phone;

//   const user_data = await db
//     .getDB()
//     .collection("users_data")
//     .findOne({ tel: phone });

//   if (user_data) {
//     input_validation.flashErorToSession(
//       req,
//       {
//         massage: "phone is already exists",
//         phone: phone,
//         confirm_phone: confirm_phone,
//       },
//       function () {
//         res.redirect("/account");
//       }
//     );
//     return;
//   }
//   await db
//     .getDB()
//     .collection("users_data")
//     .updateOne({ _id: new ObjectId(user_id) }, { $set: { tel: phone } });
//   res.render("user/user_account", {
//     user_data: user_data,
//     inputUserData: inputUserData,
//   });
// }

async function postAccountAddressChange(req, res) {
  const inputUserData = input_validation.session_inputData(req, {
    email: "",
    password: "",
  });
  const user_id = req.params.id;
  const userData = req.body;
  street = userData.street;
  postal_code = userData.postal_code;
  city = userData.city;

  await db
    .getDB()
    .collection("users_data")
    .updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          address: [
            {
              street: street,
              postal_code: postal_code,
              city: city,
            },
          ],
        },
      }
    );

  const user_data = await db
    .getDB()
    .collection("users_data")
    .findOne({ _id: new ObjectId(user_id) });

  res.render("user/user_account", {
    user_data: user_data,
    inputUserData: inputUserData,
  });
}

async function postAccountPasswordChange(req, res) {
  const inputUserData = input_validation.session_inputData(req, {
    email: "",
    password: "",
  });
  const user_id = req.params.id;
  const userData = req.body;
  password = userData.password;
  confirm_password = userData.confirm_password;

  if (password !== confirm_password) {
    input_validation.flashErorToSession(
      req,
      {
        massage: "passwords are not the same. check your input",
        password: password,
        confirm_password: confirm_password,
      },
      function () {
        res.redirect("/account");
      }
    );
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  await db
    .getDB()
    .collection("users_data")
    .updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          passwrd: hashedPassword,
        },
      }
    );

  const user_data = await db
    .getDB()
    .collection("users_data")
    .findOne({ _id: new ObjectId(user_id) });

  res.render("user/user_account", {
    user_data: user_data,
    inputUserData: inputUserData,
  });
}

async function getCardPage(req, res, next) {
  const cartsCollection = db.getDB().collection("carts");

  try {
    const userAuthID = req.session.user.id;
    const user_card_added_table = await cartsCollection.findOne({
      UserAuthID: userAuthID,
    });

    if (user_card_added_table) {
      const user_datas = await db
        .getDB()
        .collection("users_data")
        .findOne({ _id: new ObjectId(userAuthID) });

      if (user_datas) {
        user_card_added_table.address = user_datas.address[0];
      }

      user_card_added_table.UserID = userAuthID;
      for (const prod of user_card_added_table.products) {
        const restaurant = await db
          .getDB()
          .collection("restaurants")
          .findOne({ _id: prod.restaurant_id });

        prod.restaurant_detail = restaurant;

        if (restaurant) {
          for (const food of prod.foods) {
            const product_detail = restaurant.Menu.find(
              (item) => item._id === food.food_id
            );
            food.product_detail = product_detail;
          }
        }
      }

      res.render("user/user_card", {
        user_card_added_table: user_card_added_table,
        found: true,
      });
    } else {
      res.render("user/user_card", { found: false });
    }
  } catch (error) {
    // }
    console.error("Error fetching cart:", error);
    next(error); // Pass the error to Express error handler
  }
}

async function postAddToCard(req, res) {
  const restaurant_id = req.params.restaurant_id;
  const food_id = req.params.food_id;
  const guestId = req.session.guestId;
  const cartsCollection = db.getDB().collection("carts");

  try {
    const user_card_added_table = await cartsCollection.findOne({
      UserAuthID: req.session.user.id,
    });

    if (user_card_added_table) {
      const restaurant = user_card_added_table.products.find(
        (product) => product.restaurant_id === restaurant_id
      );

      if (restaurant) {
        const food = restaurant.foods.find((food) => food.food_id === food_id);

        if (food) {
          // If food exists, update the quantity
          food.quantity += 1;
        } else {
          // If food does not exist, add it to the foods array
          restaurant.foods.push({ food_id, quantity: 1 });
        }
      } else {
        // If restaurant does not exist, add it to the products array
        user_card_added_table.products.push({
          restaurant_id,
          foods: [{ food_id, quantity: 1 }],
        });
      }

      // Update the cart in the database
      await cartsCollection.updateOne(
        { UserAuthID: req.session.user.id },
        { $set: { products: user_card_added_table.products } }
      );
    } else {
      // If the cart doesn't exist, create a new one
      await cartsCollection.insertOne({
        UserAuthID: req.session.user.id,
        products: [
          {
            restaurant_id,
            foods: [{ food_id, quantity: 1 }],
          },
        ],
      });
    }

    req.session.cards = (req.session.cards || 0) + 1;
    // res.json({ cardsCount: req.session.cards });
    res.redirect(req.header("Referer") || "/restaurants");
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).send("Error updating cart");
  }
}

async function postDeleteFromCard(req, res) {
  const restaurant_id = req.params.id1;
  const user_id = req.params.id2;
  const food_id = req.params.id3;

  try {
    const userAuthID = req.session.user.id;
    const user_carts = await db
      .getDB()
      .collection("carts")
      .findOne({ UserAuthID: userAuthID });

    if (!user_carts) {
      return res.status(404).send("Cart not found");
    }

    // Find the specific product by restaurant_id
    const product = user_carts.products.find(
      (prod) => prod.restaurant_id === restaurant_id
    );

    if (!product) {
      return res.status(404).send("Restaurant not found in cart");
    }

    // Find the specific food by food_id
    const food = product.foods.find((f) => f.food_id === food_id);

    if (!food) {
      return res.status(404).send("Food item not found in cart");
    }

    const deletedQuantity = food.quantity;

    // Remove the food from the foods array
    product.foods = product.foods.filter((f) => f.food_id !== food_id);

    // Optionally, remove the product if no foods remain
    if (product.foods.length === 0) {
      user_carts.products = user_carts.products.filter(
        (prod) => prod.restaurant_id !== restaurant_id
      );
    }

    // Update the cart in the database
    await db
      .getDB()
      .collection("carts")
      .updateOne(
        { UserAuthID: userAuthID },
        { $set: { products: user_carts.products } }
      );

    // Update the session cards count
    req.session.cards = (req.session.cards || 0) - deletedQuantity;
    res.redirect("/card");
    // res.json({ cardsCount: req.session.cards });
  } catch (error) {
    console.error("Error updating cart (Authenticated):", error);
    res.status(500).send("Error updating cart");
  }
}

async function postUpdateCard(req, res) {
  const user_id = req.session.guestId;
  const restaurant_id = req.params.id1;
  const food_id = req.params.id3; // Convert product_id to ObjectId
  const quantity = parseInt(req.params.id4); // Convert quantity to integer

  try {
    const user_carts = await db
      .getDB()
      .collection("carts")
      .findOne({ UserAuthID: req.session.user.id });

    const updatedProduct = user_carts.products.find(
      (product) => product.restaurant_id === restaurant_id
    );

    const food = updatedProduct.foods.find((food) => food.food_id === food_id);
    const before_update_quantity = food.quantity;
    food.quantity = quantity;

    await db
      .getDB()
      .collection("carts")
      .updateOne(
        { UserAuthID: req.session.user.id },
        { $set: { products: user_carts.products } }
      );

    // Calculate the change in quantity and update the session cards count
    const quantityChange = quantity - before_update_quantity;
    req.session.cards = (req.session.cards || 0) + quantityChange;
    // res.redirect("/card");
    res.json({ cardsCount: req.session.cards });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).send("Error updating cart");
  }
}

async function postBuyCard(req, res) {
  const UserAuthID = req.session.user.id;
  const restaurant_id = req.params.id1;

  const user_carts_table = await db.getDB().collection("carts").findOne({
    UserAuthID: UserAuthID,
    "products.restaurant_id": restaurant_id,
  });

  const products_purchased = user_carts_table.products.find(
    (product) => product.restaurant_id === restaurant_id
  );
  const finally_products_purchased = [];

  let total = 0; // Initialize total to zero
  let total_quantity = 0;

  const restaurant = await db
    .getDB()
    .collection("restaurants")
    .findOne({ _id: restaurant_id });

  for (const product_purchased of products_purchased.foods) {
    const product_purchased_detail = restaurant.Menu.find(
      (food) => food._id === product_purchased.food_id
    );

    const productPrice = parseInt(product_purchased_detail.price); // Convert the price to an integer
    total_quantity += product_purchased.quantity;
    total += productPrice * product_purchased.quantity; // Calculate the total
    finally_products_purchased.push({
      ProductID: product_purchased_detail._id,
      ProductName: product_purchased_detail.name,
      quantity: product_purchased.quantity,
      price: productPrice, // Use the integer price
      image_path: product_purchased_detail.image_path,
    });
  }

  const user_data = await db
    .getDB()
    .collection("users_data")
    .findOne({ _id: new ObjectId(UserAuthID) });

  try {
    total += restaurant.delivery_cost;
    await db
      .getDB()
      .collection("orders")
      .insertOne({
        UserAuthID: UserAuthID,
        restaurantID: restaurant_id,
        restaurantName: restaurant.name,
        delivery_cost: restaurant.delivery_cost,
        customer_address: {
          street: user_data.address[0].street,
          postal_code: user_data.address[0].postal_code,
          city: user_data.address[0].city,
        },
        products: finally_products_purchased,
        total_price: total, // Use the calculated total
        date: new Date(),
        State: "pending",
        estimated_delivery_time: restaurant.delivery_time,
        delivery_cost: restaurant.delivery_cost,
      });

    // Clear the user's cart
    await db
      .getDB()
      .collection("carts")
      .updateOne(
        { UserAuthID: UserAuthID }, // Filter to find the correct user's cart
        {
          $pull: {
            products: { restaurant_id: restaurant_id }, // Remove the specific food_id
          },
        }
      );

    await db.getDB().collection("carts").deleteOne({ products: [] });

    req.session.cards = req.session.cards - total_quantity;
    req.session.orders = (req.session.orders || 0) + 1;
    // res.redirect(303, session.url);
    res.redirect("/orders");

    // Redirect to the Stripe checkout session
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).send("Error creating Stripe session");
  }
}

async function getOrdersPage(req, res) {
  await db.getDB().collection("orders").deleteMany({ products: [] });

  const UserAuthID = req.session.user.id;
  const orders_table = await db
    .getDB()
    .collection("orders")
    .find({ UserAuthID: UserAuthID })
    .toArray();

  if (orders_table) {
    console.log("orders_table_found");
    console.log(orders_table);

    const currentTime = new Date();

    for (order of orders_table) {
      if (order.date instanceof Date) {
        // Check if postData.date is a Date object
        order.toseeDate = order.date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        order.date = order.date.toISOString();
        const orderTime = new Date(order.start_time);
        const deliveryTime = order.estimated_delivery_time * 60 * 1000; // Convert minutes to milliseconds
        const remainingTime = Math.max(
          0,
          deliveryTime - (currentTime - orderTime)
        ); // Ensure non-negative

        order.remainingTime = remainingTime; // Pass remaining time to EJS
      }
    }

    res.render("user/user_orders", {
      orders_finally_table: orders_table,
      found: true,
    });
  } else {
    res.render("user/user_orders", {
      found: false,
    });
  }
}

async function postOrderComment(req, res) {
  const restaurant_id = req.params.id1;
  const order_id = req.params.id2;
  const comment = req.body.comment_textarea;
  const rating = parseFloat(req.body.rating[0]);

  try {
    // Update the comment in the orders collection
    await db
      .getDB()
      .collection("orders")
      .updateOne(
        { _id: new ObjectId(order_id) },
        { $set: { comment: comment, rating: rating } }
      );

    // Fetch the order details to get restaurant and product information
    const user_order = await db
      .getDB()
      .collection("orders")
      .findOne({ _id: new ObjectId(order_id) });

    // Ensure the order exists
    if (!user_order) {
      return res.status(404).send("Order not found");
    }
    const customer = await db
      .getDB()
      .collection("users_data")
      .findOne({ _id: new ObjectId(user_order.UserAuthID) });

    // Prepare the review object
    const review = {
      order_id: order_id,
      customer_name: customer.full_name,
      comment: comment,
      rating: rating,
      products: user_order.products.map((product) => ({
        name: product.ProductName,
        quantity: product.quantity,
      })),
      date: new Date(),
    };

    // Update the restaurant's reviews array
    await db
      .getDB()
      .collection("restaurants")
      .updateOne(
        { _id: restaurant_id },
        { $push: { reviews: review } } // Push the new review to the reviews array
      );

    const restaurant = await db
      .getDB()
      .collection("restaurants")
      .findOne({ _id: restaurant_id });

    const length = restaurant.reviews.length - 1;
    const new_average_rating =
      (restaurant.average_rating * length + parseFloat(rating)) / (length + 1);

    await db
      .getDB()
      .collection("restaurants")
      .updateOne(
        { _id: restaurant_id },
        { $set: { average_rating: new_average_rating } } // Push the new review to the reviews array
      );

    res.redirect("/orders");
  } catch (error) {
    console.error("Error in postOrderComment:", error);
    res.status(500).send("Error adding comment");
  }
}

module.exports = {
  getMainPage: getMainPage,
  getCardPage: getCardPage,
  postAddToCard: postAddToCard,
  postDeleteFromCard: postDeleteFromCard,
  postUpdateCard: postUpdateCard,
  postBuyCard: postBuyCard,
  getOrdersPage: getOrdersPage,
  getRestaurantsPage: getRestaurantsPage,
  getRestaurantDetailPage: getRestaurantDetailPage,
  postOrderComment: postOrderComment,
  getAccountDetailPage: getAccountDetailPage,
  postAccountEmailChange: postAccountEmailChange,
  // postAccountPhoneChange: postAccountPhoneChange,
  postAccountAddressChange: postAccountAddressChange,
  postAccountPasswordChange: postAccountPasswordChange,
};
