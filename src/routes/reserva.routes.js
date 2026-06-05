const router = require("express").Router();
const {
  createReserva,
  getMyReservas,
  getReservaById,
  confirmarReserva,
  completarReserva,
} = require("../controllers/reserva.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateFields = require("../middlewares/validateFields");
const { createReservaSchema } = require("../validators/reserva.validator");

router.use(authMiddleware);

router.post("/", validateFields(createReservaSchema), createReserva);
router.get("/me", getMyReservas);
router.get("/:id", getReservaById);
router.post("/:id/confirmar", confirmarReserva);
router.put("/:id/complete", completarReserva);

module.exports = router;
