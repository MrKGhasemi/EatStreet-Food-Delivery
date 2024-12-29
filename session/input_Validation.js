function session_inputData(req, defaultvalues) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      ...defaultvalues,
    };
  }
  req.session.inputData = null;

  return sessionInputData;
}

function flashErorToSession(req, data, action) {
  req.session.inputData = { hasError: true, ...data };
  req.session.save(action);
}

function auth_input_Is_Valid_for_signup(
  enteredEmail,
  enteredConfirmEmail,
  enteredPassword
) {
  return (
    enteredEmail &&
    enteredConfirmEmail &&
    enteredPassword &&
    enteredPassword.trim().length >= 6 &&
    enteredEmail === enteredConfirmEmail &&
    enteredEmail.includes("@")
  );
}

function auth_input_Is_Valid_for_email_change(
  enteredEmail,
  enteredConfirmEmail
) {
  return (
    enteredEmail &&
    enteredConfirmEmail &&
    enteredEmail === enteredConfirmEmail &&
    enteredEmail.includes("@")
  );
}

function auth_input_Is_Valid_for_signin(enteredEmail, enteredPassword) {
  return (
    enteredEmail &&
    enteredPassword &&
    enteredPassword.trim().length >= 6 &&
    enteredEmail.includes("@")
  );
}

module.exports = {
  session_inputData: session_inputData,
  flashErorToSession: flashErorToSession,
  auth_input_Is_Valid_for_signup: auth_input_Is_Valid_for_signup,
  auth_input_Is_Valid_for_signin: auth_input_Is_Valid_for_signin,
  auth_input_Is_Valid_for_email_change: auth_input_Is_Valid_for_email_change,
};
