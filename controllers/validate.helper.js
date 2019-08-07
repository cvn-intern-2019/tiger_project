const FirstCharUsernameRegEx = /^[a-z]/;
const userRegEx = /^[a-z0-9]*$/;
const emailRegEx = /^[a-z][a-z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;

module.exports.validateCaptchaNull = captcha => {
  if (captcha == null) {
    return false;
  }
  return true;
};

module.exports.validateFirstCharOfUsername = username => {
  if (!FirstCharUsernameRegEx.test(username)) {
    return false;
  }
  return true;
};
module.exports.validateUsername = username => {
  if (!userRegEx.test(username)) {
    return false;
  }
  return true;
};
module.exports.validateUsername = username => {
  if (!userRegEx.test(username)) {
    return false;
  }
  return true;
};
module.exports.validateMaxLengthUsername = username => {
  if (username.length < 5 || username.length > 20) {
    return false;
  }
  return true;
};
module.exports.validateEmail = email => {
  if (!emailRegEx.test(email)) {
    return false;
  }
  return true;
};
module.exports.checkMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return false;
  }
  return true;
};
