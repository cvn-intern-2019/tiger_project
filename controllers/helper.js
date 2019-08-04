var crypto = require("crypto");

module.exports.generateToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

module.exports.hashPassword = (username, password) => {
  let secret = `${username}${password}`
    .toUpperCase()
    .split("")
    .reverse()
    .join();
  return crypto
    .createHmac("SHA256", secret)
    .update(password)
    .digest("hex");
};
