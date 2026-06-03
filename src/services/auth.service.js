const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const register = async ({
  nombre,
  email,
  password,
  fecha_nacimiento,
  nacionalidad,
}) => {
  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) throw new AppError("El email ya está registrado", 409);

  const hashed = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nombre,
      email,
      password: hashed,
      fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
      nacionalidad,
    },
  });

  const token = jwt.sign(
    { id: usuario.id_usuario, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    usuario: {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
    },
    token,
  };
};

const login = async ({ email, password }) => {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new AppError("Credenciales incorrectas", 401);

  const valid = await bcrypt.compare(password, usuario.password);
  if (!valid) throw new AppError("Credenciales incorrectas", 401);

  const token = jwt.sign(
    { id: usuario.id_usuario, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    usuario: {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
    },
    token,
  };
};

module.exports = { register, login };
