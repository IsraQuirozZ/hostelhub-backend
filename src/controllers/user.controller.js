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

const updatePassword = async (req, res, next) => {
  try {
    await userService.updatePassword(req.user.id, req.body);
    res.json({ status: "success", message: "Contraseña actualizada" });
  } catch (err) {
    next(err);
  }
};

const getMyLanguages = async (req, res, next) => {
  try {
    const languages = await userService.getMyLanguages(req.user.id);
    res.json({ status: "success", data: languages });
  } catch (err) {
    next(err);
  }
};

const addLanguage = async (req, res, next) => {
  try {
    const language = await userService.addLanguage(req.user.id, req.body);
    res.status(201).json({ status: "success", data: language });
  } catch (err) {
    next(err);
  }
};

const deleteLanguage = async (req, res, next) => {
  try {
    await userService.deleteLanguage(req.user.id, req.params.codigo_iso);
    res.json({ status: "success", message: "Idioma eliminado" });
  } catch (err) {
    next(err);
  }
};

const getAllLanguages = async (req, res, next) => {
  try {
    const languages = await userService.getAllLanguages();
    res.json({ status: "success", data: languages });
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

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  updatePassword,
  getMyLanguages,
  addLanguage,
  deleteLanguage,
  getAllLanguages,
};
