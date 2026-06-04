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
        select: { id_habitacion: true, precio_base: true },
        orderBy: { precio_base: "asc" },
        take: 1,
      },
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
      capacidad: true,
      promedio_rating: true,
      ciudad: { select: { id_ciudad: true, nombre: true } },
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

module.exports = { getCities, getHostals, getTopHostals, getHostalById };
