const router = require("express").Router();
const {
  getCities,
  getHostals,
  getTopHostals,
  getHostalById,
  createReview,
} = require("../controllers/hostal.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateFields = require("../middlewares/validateFields");
const { createReviewSchema } = require("../validators/hostal.validator");

router.post(
  "/:id/reviews",
  authMiddleware,
  validateFields(createReviewSchema),
  createReview,
);

router.get("/cities", getCities);
router.get("/top", getTopHostals);
router.get("/", getHostals);
router.get("/:id", getHostalById);

module.exports = router;
