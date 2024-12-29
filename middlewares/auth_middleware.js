async function auth_middleware(req, res, next) {
  const user = req.session.user;
  const isAuth = req.session.isAuth;
  const isAdmin = req.session.isAdmin;
  const cards = req.session.cards;
  res.locals.cards = cards;
  res.locals.guestId = req.session.guestId;

  if (!user || !isAuth) {
    return next();
  }
  res.locals.isAuth = isAuth;
  res.locals.isAdmin = isAdmin;
  const orders = req.session.orders;
  res.locals.orders = orders;
  res.locals.id = user.id;
  next();
}

function guard_auth(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect("/401");
  }
  if (req.path.startsWith("/admin") && !res.locals.isAdmin) {
    return res.redirect("/403");
  }
  next();
}

module.exports = { auth_middleware: auth_middleware, guard_auth: guard_auth };
