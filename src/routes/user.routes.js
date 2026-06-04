const router = require("express").Router();
const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateFields = require("../middlewares/validateFields");
const { updateUserSchema } = require("../validators/user.validator");

router.use(authMiddleware);

router.get("/me", getProfile);
router.put("/me", validateFields(updateUserSchema), updateProfile);
router.delete("/me", deleteAccount);

module.exports = router;
