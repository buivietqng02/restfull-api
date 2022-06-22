
const express = require("express");
const router = express.Router();
const controller = require("../controller");
const jwt = require("jsonwebtoken");


const authorized = (req, res, next) => {
  
  if (
    !req.headers["authorization"] ||
    !req.headers["authorization"].startsWith("Bearer")
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = req.headers["authorization"].split(" ")[1];
 
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ message: "unauthorized" });
    else req.credential = decoded;
    next();
  });
};



router.get("/api/users/me/", authorized, controller.getProfileInfo);
router.delete("/api/users/me/", authorized, controller.deleteProfile);
router.patch("/api/users/me", authorized, controller.changeProfilePassword);
router.post("/api/auth/register", controller.createProfile);
router.post("/api/auth/login", controller.login);
router.get("/api/notes", authorized, controller.getUserNotes);
router.post("/api/notes", authorized, controller.addUserNotes);
router.get("/api/notes/:id", authorized, controller.getUserNoteById);
router.put("/api/notes/:id", authorized, controller.updateUserNoteById);
router.patch(
  "/api/notes/:id",
  authorized,
  controller.toggleCompletedForUserNoteById
);
router.delete("/api/notes/:id", authorized, controller.deleteUserNoteById);
module.exports = router;
