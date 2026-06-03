const prisma = require("../config/prisma");

const getCities = async () => {
  return await prisma.ciudad.findMany({
    select: { id_ciudad: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
};

const getHostals = async (search) => {
  return await prisma.hostal.findMany({
    where: search
      ? {
          OR: [
            { nombre: { contains: search, mode: "insensitive" } },
            { ciudad: { nombre: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    select: {
      id_hostal: true,
      nombre: true,
      descripcion: true,
      disponibilidad: true,
      capacidad: true,
      promedio_rating: true,
      ciudad: { select: { id_ciudad: true, nombre: true } },
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
