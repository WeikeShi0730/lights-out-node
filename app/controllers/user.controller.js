const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const CryptoJS = require("crypto-js");

// Create and Save a new
exports.create = async (req, res) => {
  if (!req.body.name) {
    res.status(500).send({
      message: "username cannot be empty",
    });
    return;
  } else if (!req.body.password) {
    res.status(500).send({
      message: "password cannot be empty",
    });
    return;
  } else if (!req.body.country) {
    res.status(500).send({
      message: "country cannot be empty",
    });
    return;
  }

  // Check if name is already in use
  const duplicate = await findExistName(req.body.name);
  if (duplicate) {
    res.status(500).send({
      message: "username already exists",
    });
    return;
  }

  const name = req.body.name;
  const password = req.body.password;
  const country = req.body.country;
  const encryptedPassword = encryption(name, password);
  const user = {
    name: name,
    password: encryptedPassword,
    country: country,
    timer: Number.MAX_VALUE,
  };

  try {
    const data = await User.create(user);
    const userObj = data.dataValues;
    const { password, ...userObjReturn } = userObj;
    const token = generateAccessToken({ username: name });
    userObjReturn["token"] = token;
    res.status(201).send(userObjReturn);
  } catch (error) {
    res.status(500).send({
      message: error.message || "failed to create a driver profile.",
    });
  }
};

//Sign In
exports.signIn = async (req, res) => {
  const name = req.body.name;
  const exist = await findExistName(name);
  if (!exist) {
    res.status(500).send({
      message: "cannot find the name provided",
    });
    return;
  }

  const password = req.body.password;
  const verifiedUser = await checkPassword(name, password);
  if (verifiedUser) {
    const token = generateAccessToken({ username: name });
    verifiedUser["token"] = token;
    res.status(202).send(verifiedUser);
  } else {
    res.status(500).send({
      message: "sign In failed, wrong password",
    });
  }
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  try {
    const data = await User.findAll();
    var userObjReturnArray = [];
    data.forEach((user) => {
      const userObj = user.dataValues;
      const { password, ...userObjReturn } = userObj;
      userObjReturnArray.push(userObjReturn);
    });
    userObjReturnArray.sort((user_0, user_1) => {
      return user_0.timer - user_1.timer;
    });
    res.status(200).send(userObjReturnArray);
  } catch (error) {
    res.status(500).send({
      message: error.message || "failed to create a driver profile.",
    });
  }
};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    await User.update(req.body, {
      where: { id: id },
    });
    res.status(202).send({ message: "timer updated successfully" });
  } catch (error) {
    res.status(500).send({
      message: "error updating timer with id=" + id,
    });
  }
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await User.destroy({
      where: { id: id },
    });
    res.status(200).send({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).send({
      message: "error deleting with id=" + id,
    });
  }
};

exports.deteleRecord= async (req, res) => {
  const id = req.params.id;
  try {
    await User.update(req.body, {
      where: { id: id },
    });
    res.status(200).send({ message: "user record deleted successfully" });
  } catch (error) {
    res.status(500).send({
      message: "error deleting record with id=" + id,
    });
  }
};


//private
const findExistName = async (newName) => {
  const user = await User.findAll({
    where: {
      name: newName,
    },
  });
  return user.length > 0;
};

//
const checkPassword = async (name, password) => {
  const user = await User.findAll({
    where: {
      name: name,
    },
  });
  const userObj = user[0].dataValues;
  const decryptedPassword = decrytion(name, userObj.password);
  if (password === decryptedPassword) {
    const { password, ...userOmitPassword } = userObj;
    return userOmitPassword;
  }
  return false;
};

const encryption = (passphrase, password) => {
  return CryptoJS.AES.encrypt(password, passphrase).toString();
};

const decrytion = (passphrase, encryptedPassword) => {
  return CryptoJS.AES.decrypt(encryptedPassword, passphrase).toString(
    CryptoJS.enc.Utf8
  );
};

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "7200s" });
};
