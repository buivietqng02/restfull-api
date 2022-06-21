const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var { User, Note, Credential } = require("../models/schema.js");
exports.getProfileInfo = function (req, res, next) {
  const credential = req.credential;
  User.findOne({ username: credential.username }, function (err, user) {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(400).json({ message: "not found" });
    return res.status(200).json(user);
  });
};
exports.deleteProfile = async function (req, res, next) {
  try {
    const credential = req.credential;
    const user = await User.findOneAndDelete({ username: credential.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.changeProfilePassword = function (req, res, next) {
  const credential = req.credential;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: "missing content" });
  Credential.findOne(
    { username: credential.username },
    function (err, credential) {
      if (err) return res.status(500).json({ message: err.message });
      if (credential.validPassword(oldPassword))
        return res.status(400).json({ message: "wrong old password" });
      credential.password = credential.encryptPassword(newPassword);
      credential.save(function (err) {
        if (err) return res.status(500).json({ message: err.message });
        return res
          .status(200)
          .json({ message: "password changed successfully" });
      });
    }
  );
};
exports.createProfile = function (req, res, next) {
  const { username, password } = req.body;
  Credential.findOne({ username: username }, function (err, credential) {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    } else if (credential) {
      return res.status(409).json({
        message: "Username already exists",
      });
    } else {
      const newCredential = new Credential({ username });
      newCredential.password = newCredential.encryptPassword(password);

      newCredential.save(function (err, credential) {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        const user = new User({
          username: credential.username,
          createdDate: new Date().toString(),
        });
        user.save(function (err, user) {
          if (err) return res.status(500).json({ message: err.message });
          return res.status(200).json({ message: "success" });
        });
      });
    }
  });
};
exports.login = function (req, res, next) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "missing usename or password" });
  Credential.findOne({ username }, function (err, credential) {
    if (err) return res.status(500).json({ message: err.message });
    if (!credential)
      return res.status(400).json({ message: "username not found" });
    if (!credential.validPassword(password))
      return res.status(400).json({ message: "wrong password" });
    const token = jwt.sign({ username, password }, process.env.SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "success", token });
  });
};
exports.getUserNotes = function (req, res, next) {
  const credential = req.credential;
  User.findOne({ username: credential.username }, function (err, user) {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(400).json({ message: "no user found" });
    const offset = parseInt(req.query.offset,10)||0;
    const limit = parseInt(req.query.limit,10) ||0;
    Note.find({ userId: user._id })
      .skip(offset)
      .limit(limit)
      .exec(function (err, notes) {
       
        if (err) return res.status(500).json({ message: err.message });
       
        return res.status(200).json({
          offset,
          limit,
          count: notes.length,
          notes,
        });
      });
  });
};

exports.addUserNotes = function (req, res, next) {
  const text = req.body.text;
  if (!text) return res.status(400).json({ message: "no content" });
  const credential = req.credential;
  User.findOne({ username: credential.username }, function (err, user) {
    if (err) return res.status(500).json({ message: err.message });
    const note = new Note({
      text,
      userId: user._id,
      completed: false,
      createdDate: new Date().toString(),
    });
    note.save(function (err, note) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "success" });
    });
  });
};
exports.getUserNoteById = function (req, res, next) {
  const id = req.params.id;
  Note.findById({ _id: id }, function (err, note) {
    if (err) return res.status(500).json({ message: err.message });
    if (!note)
      return res.status(400).json({ message: "no note found with thid id" });
    return res.status(200).json(note);
  });
};
exports.updateUserNoteById = function (req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  if (!text) return res.status(400).json({ message: "no content" });
  Note.findById({ _id: id }, function (err, note) {
    if (err) return res.status(500).json({ message: err.message });
    if (!note)
      return res.status(400).json({ message: "no note found with thid id" });
    note.text = text;
    note.save(function (err, note) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "success" });
    });
  });
};
exports.toggleCompletedForUserNoteById = function (req, res, next) {
  const id = req.params.id;
  Note.findById({ _id: id }, function (err, note) {
    if (err) return res.status(500).json({ message: err.message });
    if (!note)
      return res.status(400).json({ message: "no note found with thid id" });
    note.completed = !note.completed;
    note.save(function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "success" });
    });
  });
};
exports.deleteUserNoteById = function (req, res, next) {
  const id = req.params.id;
  Note.findByIdAndDelete({ _id: id }, function (err, note) {
    if (err) return res.status(500).json({ message: err.message });
    if (!note)
      return res.status(400).json({ message: "no note found with thid id" });
    res.status(200).json({ message: "success" });
  });
};
