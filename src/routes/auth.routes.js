const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const validateFields = require("../middlewares/validateFields");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

router.post("/register", validateFields(registerSchema), register);
router.post("/login", validateFields(loginSchema), login);

module.exports = router;
