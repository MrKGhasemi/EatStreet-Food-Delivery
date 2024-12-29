const express = require("express");
const app = express();
const Path = require("path");
const auth_Routes = require("./routes/auth_routes");
const user_Routes = require("./routes/user_routes");
const admin_Routes = require("./routes/admin_routes");
const uuid = require("uuid");
const db = require("./data/database");
const session = require("express-session");
const Session_Config = require("./session/session_config");
const csrf = require("csurf");
const auth_middleware = require("./middlewares/auth_middleware");
const csrf_token = require("./middlewares/csrf_token");

app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "views"));

app.use("/images", express.static(__dirname + "/images"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const session_info_for_store = Session_Config.SessionStoreConfig(session);
app.use(session(Session_Config.SessionCreate(session_info_for_store)));

app.use(function (req, res, next) {
  if (req.session.guestId === undefined || !req.session.guestId) {
    req.session.guestId = uuid.v4();
    req.session.cards = 0; // Initialize cards count
  }
  next();
});

app.use(csrf());
app.use(csrf_token.CSRFToken);
app.use(auth_middleware.auth_middleware);

app.use(auth_Routes);
app.use(user_Routes);
app.use(admin_Routes);

app.use(function (req, res) {
  res.status(404).render("error/404");
});

app.use(function (req, res) {
  res.status(500).render("error/500");
});

db.connectToDB().then(function () {
  app.listen(5000);
});
