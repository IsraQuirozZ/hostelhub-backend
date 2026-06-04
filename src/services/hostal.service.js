const prisma = require("../config/prisma");

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

module.exports = { getCities, getHostals, getTopHostals };
