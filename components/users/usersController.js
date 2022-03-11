const USER = require('./usersDAL.js');
const MAIL = require('./mailController');
const UTILS = require('../../lib/utilities');

async function handleTargets(info) {
  const { firstname, lastname, email, username } = info;
  const userInfo = { firstname, lastname, email, username };
  const formattedTargets = UTILS.formatPhoneNumbers(USER.getTargets());
  UTILS.writeToCSVFile(username, formattedTargets);
  await MAIL.userAccountEmail(userInfo);

  var targetsSaved = await USER.saveTargets(username, formattedTargets);

  if (targetsSaved) {
    MAIL.adminAccountEmail(userInfo);
  } else {
    MAIL.adminErrorEmail(userInfo);
  }
}

async function createUser(req, res) {
  const FORM_INPUT =
    { firstname, lastname, email, username, password } = req.body;

  const reRenderRegistrationForm = (errMsg) => {
    res.render('register', {
      errorMessages: [errMsg],
      title: 'Correct Form Errors',
      firstname,
      lastname,
      email,
      username,
    });
  }

  try {
    const userSaved = await USER.saveUser(FORM_INPUT);

    if (userSaved) {
      res.redirect('/users/signin');
      handleTargets(FORM_INPUT);
    } else {
      const errMsg = `An account with entered email or username exists.`
      reRenderRegistrationForm(errMsg);
    }
  } catch (error) {
    console.log(error);
    const errMsg = 'Database Error'
    MAIL.adminErrorEmail(userInfo, errMsg);
    reRenderRegistrationForm(errMsg);
  }
}

module.exports = { createUser };