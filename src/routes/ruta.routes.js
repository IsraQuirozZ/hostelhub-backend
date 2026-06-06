const router = require("express").Router();
const {
  generateRuta,
  getRutaByReserva,
} = require("../controllers/ruta.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/generate", generateRuta);
router.get("/:id_reserva", getRutaByReserva);

module.exports = router;
