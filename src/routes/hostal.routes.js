const router = require("express").Router();
const {
  getCities,
  getHostals,
  getTopHostals,
} = require("../controllers/hostal.controller");

router.get("/cities", getCities);
router.get("/top", getTopHostals);
router.get("/", getHostals);

module.exports = router;
