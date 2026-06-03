const hostalService = require("../services/hostal.service");

const getCities = async (req, res, next) => {
  try {
    const cities = await hostalService.getCities();
    res.json({ status: "success", data: cities });
  } catch (err) {
    next(err);
  }
};

const getHostals = async (req, res, next) => {
  try {
    const { search } = req.query;
    const hostals = await hostalService.getHostals(search);
    res.json({ status: "success", data: hostals });
  } catch (err) {
    next(err);
  }
};

const getTopHostals = async (req, res, next) => {
  try {
    const hostals = await hostalService.getTopHostals();
    res.json({ status: "success", data: hostals });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCities, getHostals, getTopHostals };
