const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const happyHomeController = require("../controllers/happyhomes");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, happyHomeController.getHappyHome);

router.get("/noAuth/:id", happyHomeController.getHappyHomeNoAuth)

router.post("/createHappyHome", upload.single("file"), happyHomeController.createHappyHome);

router.put("/likeHappyHome/:id", happyHomeController.likeHappyHome);

router.delete("/deleteHappyHome/:id", happyHomeController.deleteHappyHome);

router.get("/editHappyHome/:id", ensureAuth, happyHomeController.editHappyHome);

router.put("/editHappyHomeWrite/:id", upload.single("file"), happyHomeController.editHappyHomeWrite)

router.put("/deleteHappyHomeImage/:id", ensureAuth, happyHomeController.deleteHappyHomeImage);

module.exports = router;
