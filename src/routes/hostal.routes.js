const router = require("express").Router();
const {
  getCities,
  getHostals,
  getTopHostals,
  getHostalById,
} = require("../controllers/hostal.controller");

router.get("/cities", getCities);
router.get("/top", getTopHostals);
router.get("/", getHostals);
router.get("/:id", getHostalById);

module.exports = router;
