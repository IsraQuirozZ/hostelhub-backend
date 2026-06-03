const userService = require("../services/user.service");

const getProfile = async (req, res, next) => {
  try {
    const usuario = await userService.getProfile(req.user.id);
    res.json({ status: "success", data: usuario });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const usuario = await userService.updateProfile(req.user.id, req.body);
    res.json({ status: "success", data: usuario });
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await userService.deleteAccount(req.user.id);
    res.json({ status: "success", message: "Cuenta eliminada" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, deleteAccount };
