const express = require("express");
const router = express.Router();
const guard_auth = require("../middlewares/auth_middleware");
const user_controllers = require("../controllers/user_controllers");

router.get("/", user_controllers.getMainPage);

router.get("/restaurants", user_controllers.getRestaurantsPage);

router.get("/card", user_controllers.getCardPage);

router.use(guard_auth.guard_auth);

router.get("/account", user_controllers.getAccountDetailPage);

router.post("/account/:id/email", user_controllers.postAccountEmailChange);

router.post(
  "/account/:id/password",
  user_controllers.postAccountPasswordChange
);

router.post("/account/:id/address", user_controllers.postAccountAddressChange);

router.get(
  "/restaurants/:id/detail",
  user_controllers.getRestaurantDetailPage
);

router.post(
  "/restaurants/:restaurant_id/:food_id/add_to_card",
  user_controllers.postAddToCard
);

router.post(
  "/card/:id1/:id2/:id3/deleted",
  user_controllers.postDeleteFromCard
);

router.post(
  "/card/:id1/:id2/:id3/:id4/updated",
  user_controllers.postUpdateCard
);

router.post("/card/:id1/:id2/buy", user_controllers.postBuyCard);

router.get("/orders", user_controllers.getOrdersPage);

router.post("/orders/:id1/:id2/comment", user_controllers.postOrderComment);

module.exports = router;
