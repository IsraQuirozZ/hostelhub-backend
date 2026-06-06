const rutaService = require("../services/ruta.service");

const generateRuta = async (req, res, next) => {
  try {
    const ruta = await rutaService.generateRuta(
      Number(req.body.id_reserva),
      req.user.id,
    );
    res.status(201).json({ status: "success", data: ruta });
  } catch (err) {
    next(err);
  }
};

const getRutaByReserva = async (req, res, next) => {
  try {
    const ruta = await rutaService.getRutaByReserva(
      Number(req.params.id_reserva),
      req.user.id,
    );
    res.json({ status: "success", data: ruta });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateRuta, getRutaByReserva };
