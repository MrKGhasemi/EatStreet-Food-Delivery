const input_validation = require("../session/input_Validation");
const auth_connection_model = require("../model/auth_connection");

function getLogin(req, res) {
  let inputUserData = input_validation.session_inputData(req, {
    email: "",
    password: "",
  });
  res.render("auth/login", { inputUserData: inputUserData });
}

async function postLogin(req, res) {
  const userData = req.body;
  email = userData.email;
  password = userData.password;
  const Auth_connection_model = new auth_connection_model(
    req,
    email,
    null,
    password,
    null,
    null,
    null,
    null
  );
  const user_exist = await Auth_connection_model.check_for_sign_in();
  if (!input_validation.auth_input_Is_Valid_for_signin(email, password)) {
    input_validation.flashErorToSession(
      req,
      { massage: "check your input", email: email, password: password },
      function () {
        res.redirect("login");
      }
    );
    return;
  }
  if (!user_exist) {
    input_validation.flashErorToSession(
      req,
      {
        massage: "email or password is incorrect",
        email: email,
        password: password,
      },
      function () {
        res.redirect("login");
      }
    );
    return;
  }
  await Auth_connection_model.make_session_for_sign_in();
  if (req.session.isAdmin) {
    res.redirect("http://localhost:5000/admin");
  } else {
    res.redirect("/restaurants");
  }
}

function getSignup(req, res) {
  let inputUserData = input_validation.session_inputData(req, {
    email: "",
    confirm_email: "",
    password: "",
    full_name: "",
    tel: "",
    street: "",
    postal_code: "",
    city: "",
  });
  res.render("auth/signup", { inputUserData: inputUserData });
}

async function postSignup(req, res) {
  const userData = req.body;
  email = userData.email;
  confirm_email = userData.confirm_email;
  password = userData.password;
  tel = userData.tel;
  fullname = userData.full_name;
  street = userData.street;
  postal_code = userData.postal_code;
  city = userData.city;

  if (
    !input_validation.auth_input_Is_Valid_for_signup(
      email,
      confirm_email,
      password
    )
  ) {
    input_validation.flashErorToSession(
      req,
      {
        massage: "check your input",
        email: email,
        confirm_email: confirm_email,
        password: password,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }
  const Auth_connection_model = new auth_connection_model(
    req,
    email,
    confirm_email,
    password,
    tel,
    fullname,
    street,
    postal_code,
    city
  );
  const user_existance =
    await Auth_connection_model.Check_Existing_user_base_email_entered();
  if (user_existance) {
    input_validation.flashErorToSession(
      req,
      {
        massage: "user already exist",
        email: email,
        confirm_email: confirm_email,
        password: password,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }
  await Auth_connection_model.sign_up();
  res.redirect("/login");
}

async function postLogout(req, res) {
  const Auth_connection_model = new auth_connection_model(
    req,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  await Auth_connection_model.config_session_for_log_out();
  res.redirect("/");
}

function get401(req, res) {
  res.status(401).render("error/401");
}

function get403(req, res) {
  res.status(403).render("error/403");
}

module.exports = {
  getLogin: getLogin,
  postLogin: postLogin,
  getSignup: getSignup,
  postSignup: postSignup,
  postLogout: postLogout,
  get401: get401,
  get403: get403,
};
