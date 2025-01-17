const express = require("express");
const router = express.Router();

const verifyLoggedUser = require("../middlewares/VerifyLoggedUser");
const verifyNotLoggedUser = require("../middlewares/VerifyNotLoggedUser");

const TaskController = require("../controllers/TaskController");
const TypeOfElementController = require("../controllers/TypeOfElementController");
const CharacterController = require("../controllers/CharacterController");
const EquipController = require("../controllers/EquipController");

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

router.post("/character-creation/", async (req, res) => {
  let {CHARACTER_SET} = req.body;
  res.cookie('CHARACTER_SET', CHARACTER_SET, {maxAge: 60000});
  res.status(201).redirect("/User/signup")
})

/* GET reference page for sidebar and navbar components (TEST) */
router.get("/homepage", verifyLoggedUser, async function (req, res, next) {
  const { user } = req.session;
  const userId = user.id;
  const workspaceId = user.activeWorkspace.id;
  const allTasks = await TaskController.getAllTasks(workspaceId);
  const character = await CharacterController.getCharacterByUserId(userId);
  const characterVisualElements = await EquipController.findCharacterElements(character.id);

  user.character = character;
  user.elements = characterVisualElements;

  return res.render("homepage", { allTasks, user });
});

/* GET dashboard page */
router.get("/dashboard", verifyLoggedUser, function (req, res, next) {
  res.render("dashboard", { user: req.session.user });
});

/* GET inventory/store page */
router.get("/inventory", verifyLoggedUser, async function (req, res, next) {
  const user = req.session.user;
  const allElements = await EquipController.findAllEquips();
  const ownedEquips = await CharacterController.getOwnedEquipments(user.character.id);

  for(let i = 0; i < allElements.length; i++) { // NOT WORKING PROPERLY
    for (let j = 0; j < ownedEquips.length; j++) {
      if (allElements[i].id === ownedEquips[j].elementId) {
        allElements[i].is_owned = 'owned';
        console.log(allElements[i])
      } else {
        allElements[i].is_owned = 'notOwned';
        
      }
    }
  }

  res.render("inventory-store", { user, allElements, ownedEquips });
});

router.post("/inventory", async function (req, res) {
  const { element_id } = req.body;
  const characterId = req.session.user.character.id;

  CharacterController.purchaseEquipment(characterId, Number(element_id))

  res.render("inventory-store", { user: req.session.user });
});

router.patch("/inventory", async function (req, res) {
  const id = req.body;
  const user = req.session.user;
  const ownedEquips = await CharacterController.getOwnedEquipments(user.character.id);
  const allElements = await EquipController.findAllEquips();

  await EquipController.setEquipmentStatus(Number(id.id));

  const characterVisualElements = await EquipController.findCharacterElements(user.character.id);

  user.elements = characterVisualElements;

  res.render("inventory-store", { user, ownedEquips, allElements });
});

module.exports = router;
