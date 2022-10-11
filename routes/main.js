const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const happyHomeController = require("../controllers/happyhomes");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/googlemapstest", (req, res) => {
    res.render('googlemapstest', {googlemapsapikey: process.env.GOOGLEMAPS_API_KEY});
})
router.get("/", homeController.getIndex);
router.get("/credits", homeController.getCredits);
router.get("/about", homeController.getAbout);
router.get("/contact", homeController.getContact);
router.get("/contribute",homeController.getContribute);
router.get("/profile", ensureAuth, happyHomeController.getProfile);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.post("/signup", authController.postSignup);
router.get("/signup", authController.getSignup);

module.exports = router;
