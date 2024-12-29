function CSRFToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = { CSRFToken: CSRFToken };
