const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const getCities = async () => {
  return await prisma.ciudad.findMany({
    select: { id_ciudad: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
};

const getHostals = async ({ search, city } = {}) => {
  const where = {};

  if (city) {
    where.ciudad = { nombre: { equals: city, mode: "insensitive" } };
  } else if (search) {
    where.OR = [
      { nombre: { contains: search, mode: "insensitive" } },
      { ciudad: { nombre: { contains: search, mode: "insensitive" } } },
    ];
  }

  return await prisma.hostal.findMany({
    where,
    select: {
      id_hostal: true,
      nombre: true,
      descripcion: true,
      disponibilidad: true,
      promedio_rating: true,
      ciudad: { select: { id_ciudad: true, nombre: true } },
      servicios: {
        select: {
          servicio: {
            select: { id_servicio: true, nombre: true, icono: true },
          },
        },
      },
      habitaciones: {
        select: { precio_base: true },
        orderBy: { precio_base: "asc" },
        take: 1,
      },
      _count: { select: { ratings: true } },
    },
    orderBy: { nombre: "asc" },
  });
};

const getTopHostals = async () => {
  return await prisma.hostal.findMany({
    select: {
      id_hostal: true,
      nombre: true,
      descripcion: true,
      disponibilidad: true,
      promedio_rating: true,
      ciudad: { select: { id_ciudad: true, nombre: true } },
      servicios: {
        select: {
          servicio: {
            select: { id_servicio: true, nombre: true, icono: true },
          },
        },
      },
      habitaciones: {
        select: { precio_base: true },
        orderBy: { precio_base: "asc" },
        take: 1,
      },
      _count: { select: { ratings: true } }, // 👈
    },
    orderBy: { promedio_rating: "desc" },
    take: 5,
  });
};

const getHostalById = async (id) => {
  const hostal = await prisma.hostal.findUnique({
    where: { id_hostal: id },
    select: {
      id_hostal: true,
      nombre: true,
      descripcion: true,
      disponibilidad: true,
      capacidad: true,
      promedio_rating: true,
      ciudad: { select: { id_ciudad: true, nombre: true } },
      direccion: {
        select: {
          calle: true,
          numero: true,
          codigo_postal: true,
          latitud: true,
          longitud: true,
        },
      },
      servicios: {
        select: {
          servicio: {
            select: { id_servicio: true, nombre: true, icono: true },
          },
        },
      },
      habitaciones: {
        select: {
          id_habitacion: true,
          tipo: true,
          descripcion: true,
          disponibilidad: true,
          capacidad: true,
          precio_base: true,
        },
        orderBy: { precio_base: "asc" },
      },
      ratings: {
        select: {
          puntuacion: true,
          contenido: true,
          fecha_valoracion: true,
          usuario: { select: { nombre: true, nacionalidad: true } },
        },
        orderBy: { fecha_valoracion: "desc" },
      },
    },
  });

  if (!hostal) throw new AppError("Hostal no encontrado", 404);
  return hostal;
};

const createReview = async (
  id_hostal,
  id_usuario,
  { puntuacion, contenido },
) => {
  const hostal = await prisma.hostal.findUnique({ where: { id_hostal } });
  if (!hostal) throw new AppError("Hostal no encontrado", 404);

  // Verificar reserva completada en este hostal
  const reservaCompletada = await prisma.reserva.findFirst({
    where: {
      id_usuario,
      estado: "completada",
      habitaciones: {
        some: { habitacion: { id_hostal } },
      },
    },
  });
  if (!reservaCompletada)
    throw new AppError(
      "Necesitas una reserva completada en este hostal para dejar una review",
      403,
    );

  // Verificar si ya dejó una review
  const reviewExistente = await prisma.ratingHostal.findUnique({
    where: { id_hostal_id_usuario: { id_hostal, id_usuario } },
  });
  if (reviewExistente)
    throw new AppError("Ya has dejado una review para este hostal", 400);

  // Crear review
  const review = await prisma.ratingHostal.create({
    data: { id_hostal, id_usuario, puntuacion, contenido },
  });

  // Recalcular promedio
  const ratings = await prisma.ratingHostal.findMany({
    where: { id_hostal },
    select: { puntuacion: true },
  });
  const promedio =
    ratings.reduce((acc, r) => acc + r.puntuacion, 0) / ratings.length;
  await prisma.hostal.update({
    where: { id_hostal },
    data: { promedio_rating: +promedio.toFixed(1) },
  });

  return review;
};

module.exports = {
  getCities,
  getHostals,
  getTopHostals,
  getHostalById,
  createReview,
};
