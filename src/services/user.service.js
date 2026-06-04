const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");

const getProfile = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
      sobre_mi: true,
      nacionalidad: true,
      fecha_nacimiento: true,
      created_at: true,
      _count: {
        select: {
          paises_visitados: true,
        },
      },
    },
  });

  if (!usuario) throw new AppError("Usuario no encontrado", 404);

  const reservasConfirmadas = await prisma.reserva.count({
    where: { id_usuario: id, estado: "confirmada" },
  });

  return {
    ...usuario,
    _count: {
      paises_visitados: usuario._count.paises_visitados,
      reservas_confirmadas: reservasConfirmadas,
    },
  };
};

const updateProfile = async (id, data) => {
  const usuario = await prisma.usuario.update({
    where: { id_usuario: id },
    data: {
      ...data,
      fecha_nacimiento: data.fecha_nacimiento
        ? new Date(data.fecha_nacimiento)
        : undefined,
    },
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
      sobre_mi: true,
      nacionalidad: true,
      fecha_nacimiento: true,
    },
  });

  return usuario;
};

const updatePassword = async (id, { currentPassword, newPassword }) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
  });
  if (!usuario) throw new AppError("Usuario no encontrado", 404);

  const valid = await bcrypt.compare(currentPassword, usuario.password);
  if (!valid) throw new AppError("Contraseña actual incorrecta", 401);

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.usuario.update({
    where: { id_usuario: id },
    data: { password: hashed },
  });
};

const getMyLanguages = async (id) => {
  return await prisma.usuarioIdioma.findMany({
    where: { id_usuario: id },
    select: {
      nivel: true,
      idioma: { select: { codigo_iso: true, nombre: true } },
    },
  });
};

const addLanguage = async (id, { codigo_iso, nivel }) => {
  const idioma = await prisma.idioma.findUnique({ where: { codigo_iso } });
  if (!idioma) throw new AppError("Idioma no encontrado", 404);

  return await prisma.usuarioIdioma.upsert({
    where: { id_usuario_codigo_iso: { id_usuario: id, codigo_iso } },
    update: { nivel },
    create: { id_usuario: id, codigo_iso, nivel },
  });
};

const deleteLanguage = async (id, codigo_iso) => {
  const existing = await prisma.usuarioIdioma.findUnique({
    where: { id_usuario_codigo_iso: { id_usuario: id, codigo_iso } },
  });
  if (!existing) throw new AppError("Idioma no encontrado", 404);

  await prisma.usuarioIdioma.delete({
    where: { id_usuario_codigo_iso: { id_usuario: id, codigo_iso } },
  });
};

const getAllLanguages = async () => {
  return await prisma.idioma.findMany({
    orderBy: { nombre: "asc" },
  });
};

const deleteAccount = async (id) => {
  await prisma.usuario.delete({ where: { id_usuario: id } });
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
