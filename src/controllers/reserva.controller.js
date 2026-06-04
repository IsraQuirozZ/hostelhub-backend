const reservaService = require("../services/reserva.service");

const createReserva = async (req, res, next) => {
  try {
    const reserva = await reservaService.createReserva(req.user.id, req.body);
    res.status(201).json({ status: "success", data: reserva });
  } catch (err) {
    next(err);
  }
};

const getMyReservas = async (req, res, next) => {
  try {
    const reservas = await reservaService.getMyReservas(req.user.id);
    res.json({ status: "success", data: reservas });
  } catch (err) {
    next(err);
  }
};

const getReservaById = async (req, res, next) => {
  try {
    const reserva = await reservaService.getReservaById(
      Number(req.params.id),
      req.user.id,
    );
    res.json({ status: "success", data: reserva });
  } catch (err) {
    next(err);
  }
};

const confirmarReserva = async (req, res, next) => {
  try {
    const reserva = await reservaService.confirmarReserva(
      Number(req.params.id),
      req.user.id,
    );
    res.json({ status: "success", data: reserva });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReserva,
  getMyReservas,
  getReservaById,
  confirmarReserva,
};
