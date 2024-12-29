const express = require("express");
const router = express.Router();
const auth_controllers = require("../controllers/auth_controllers");

router.get("/login", auth_controllers.getLogin);

router.post("/logined", auth_controllers.postLogin);

router.get("/signup", auth_controllers.getSignup);

router.post("/signed_up", auth_controllers.postSignup);

router.post("/logout", auth_controllers.postLogout);

router.get("/401", auth_controllers.get401);

router.get("/403", auth_controllers.get403);

module.exports = router;
