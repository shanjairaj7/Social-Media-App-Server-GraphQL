const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

exports.comparePassword = async (passwordInput, hashedPassword) => {
  return await bcrypt.compare(passwordInput, hashedPassword);
};

exports.generateToken = (user) => {
  const token = jwt.sign(user, process.env.PRIVATE_KEY, {
    expiresIn: "24h",
  });
  return token;
};

exports.getUserFromJWT = (token) => {
  try {
    const user = jwt.verify(token, process.env.PRIVATE_KEY);
    return user;
  } catch (error) {
    return null;
  }
};
