const router = require("express").Router();
const {
  getProfile,
  updateProfile,
  deleteAccount,
  updatePassword,
  getMyLanguages,
  addLanguage,
  deleteLanguage,
  getAllLanguages,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateFields = require("../middlewares/validateFields");
const {
  updateUserSchema,
  updatePasswordSchema,
  addLanguageSchema,
} = require("../validators/user.validator");

router.use(authMiddleware);

router.get("/me", getProfile);
router.put("/me", validateFields(updateUserSchema), updateProfile);
router.delete("/me", deleteAccount);
router.put(
  "/me/password",
  validateFields(updatePasswordSchema),
  updatePassword,
);

router.get("/me/languages", getMyLanguages);
router.post("/me/languages", validateFields(addLanguageSchema), addLanguage);
router.delete("/me/languages/:codigo_iso", deleteLanguage);

router.get("/languages", getAllLanguages);

module.exports = router;
