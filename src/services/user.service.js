const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

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
    },
  });

  if (!usuario) throw new AppError("Usuario no encontrado", 404);
  return usuario;
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

const deleteAccount = async (id) => {
  await prisma.usuario.delete({ where: { id_usuario: id } });
};

module.exports = { getProfile, updateProfile, deleteAccount };
