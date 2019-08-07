const FirstCharUsernameRegEx = /^[a-z]/;
const userRegEx = /^[a-z0-9]*$/;
const emailRegEx = /^[a-z][a-z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;

const fullnameRegEx = /^[a-zA-Z\u00c0-\u1ef9 ]{1,50}$/;
const genderRegEx = /^(true|false)$/;
const phoneRegEx = /^[0-9]{4,13}$/;
const dobRegEx = /^\d{4}(\-)(((0)[0-9])|((1)[0-2]))(\-)([0-2][0-9]|(3)[0-1])$/;

module.exports.validateFullname = fullname => {
  if (!fullnameRegEx.test(fullname)) {
    return false;
  }
  return true;
};
module.exports.validateGender = phone => {
  if (!phoneRegEx.test(phone)) {
    return false;
  }
  return true;
};
module.exports.validateDob = dob => {
  if (!dobRegEx.test(dob)) {
    return false;
  }
  return true;
};
module.exports.validatePhoneNum = phone => {
  if (!phoneRegEx.test(phone)) {
    return false;
  }
  return true;
};
module.exports.validateGender = gender => {
  if (!genderRegEx.test(gender)) {
    return false;
  }
  return true;
};

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
