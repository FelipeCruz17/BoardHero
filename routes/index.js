const express = require("express");
const router = express.Router();

const verifyLoggedUser = require("../middlewares/VerifyLoggedUser");
const verifyNotLoggedUser = require("../middlewares/VerifyNotLoggedUser");

const TaskController = require("../controllers/TaskController");
const TypeOfElementController = require("../controllers/TypeOfElementController");

/* GET home page */
router.get("/", verifyNotLoggedUser, function (req, res, next) {
  res.render("index");
});

/* GET home page */
router.get("/index", verifyNotLoggedUser, function (req, res, next) {
  res.render("index");
});

/* GET character or signup options page  */
router.get("/char-login", verifyNotLoggedUser, function (req, res, next) {
  res.render("char-login");
});

/* GET character creation page */
router.get("/character-creation/", verifyNotLoggedUser, async function (req, res) {
  const typeOfElements = await TypeOfElementController.findAll();
  res.render("character-creation", { typeOfElements });
});

router.post("/character-creation*", async (req, res) => {
  let {CHARACTER_SET} = req.body;
  res.cookie('CHARACTER_SET', CHARACTER_SET, {maxAge: 60000});
  res.status(201).redirect("/User/signup")
})

/* GET reference page for sidebar and navbar components (TEST) */
router.get("/homepage", verifyLoggedUser, async function (req, res, next) {
  const allTasks = await TaskController.getAllTasks();
  // console.log(allTasks);
  const { CHARACTER_SET } = req.cookies;

  res.cookie('CHARACTER_SET', CHARACTER_SET, {maxAge: 60000});
  return res.render("homepage", { allTasks, user: req.session.user });
});

/* GET dashboard page */
router.get("/dashboard", verifyLoggedUser, function (req, res, next) {
  res.render("dashboard", { user: req.session.user });
});

/* GET inventory/store page */
router.get("/inventory", verifyLoggedUser, function (req, res, next) {
  res.render("inventory-store", { user: req.session.user });
});

module.exports = router;
