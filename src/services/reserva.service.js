const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { unirseAChatsDeReserva } = require("./chat.service");

// Helpers
const marcarCompletadas = async (id_usuario) => {
  const ahora = new Date();
  await prisma.reserva.updateMany({
    where: {
      id_usuario,
      estado: "confirmada",
      fecha_fin: { lt: ahora },
    },
    data: { estado: "completada" },
  });
};

const actualizarPaisesVisitados = async (id_reserva, id_usuario) => {
  const reserva = await prisma.reserva.findUnique({
    where: { id_reserva },
    include: {
      habitaciones: {
        include: {
          habitacion: {
            include: {
              hostal: {
                include: {
                  ciudad: {
                    include: { pais: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const codigo_pais =
    reserva.habitaciones[0]?.habitacion?.hostal?.ciudad?.pais?.codigo_pais;
  if (!codigo_pais) return;

  const yaVisitado = await prisma.usuarioPaises.findUnique({
    where: { id_usuario_codigo_pais: { id_usuario, codigo_pais } },
  });

  if (!yaVisitado) {
    await prisma.usuarioPaises.create({
      data: { id_usuario, codigo_pais, visitas: 1 },
    });
  }
};

// Services
const createReserva = async (id_usuario, data) => {
  const { id_habitacion, fecha_inicio, fecha_fin, num_personas } = data;

  // 1. Verificar que la habitación existe
  const habitacion = await prisma.habitacion.findUnique({
    where: { id_habitacion },
    include: { hostal: true },
  });
  if (!habitacion) throw new AppError("Habitación no encontrada", 404);
  if (!habitacion.disponibilidad)
    throw new AppError("Habitación no disponible", 400);

  // 2. Verificar que num_personas no supera la capacidad
  if (num_personas > habitacion.capacidad) {
    throw new AppError(
      `La habitación tiene capacidad máxima de ${habitacion.capacidad} personas`,
      400,
    );
  }

  // 3. Calcular noches y total
  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);
  const noches = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
  const precio_noche = Number(habitacion.precio_base);
  const subtotal = precio_noche * noches;
  const impuestos = +(subtotal * 0.21).toFixed(2); // IVA 21%
  const total = +(subtotal + impuestos).toFixed(2);

  // 4. Crear reserva + reserva_habitacion + factura en una transacción
  const reserva = await prisma.$transaction(async (tx) => {
    // Crear reserva
    const nuevaReserva = await tx.reserva.create({
      data: {
        id_usuario,
        fecha_inicio: inicio,
        fecha_fin: fin,
        num_personas,
        total,
        estado: "pendiente",
      },
    });

    // Vincular habitación
    await tx.reservaHabitacion.create({
      data: {
        id_reserva: nuevaReserva.id_reserva,
        id_habitacion,
        precio_noche,
      },
    });

    // Crear factura automáticamente
    await tx.factura.create({
      data: {
        id_reserva: nuevaReserva.id_reserva,
        estado: "pendiente",
        subtotal,
        impuestos,
        total,
      },
    });

    return nuevaReserva;
  });

  return {
    id_reserva: reserva.id_reserva,
    estado: reserva.estado,
    total: reserva.total,
    fecha_reserva: reserva.fecha_reserva,
  };
};

const getMyReservas = async (id_usuario) => {
  // Primero marcar las que ya vencieron
  await marcarCompletadas(id_usuario);

  return await prisma.reserva.findMany({
    where: { id_usuario },
    select: {
      id_reserva: true,
      estado: true,
      total: true,
      fecha_inicio: true,
      fecha_fin: true,
      num_personas: true,
      habitaciones: {
        select: {
          precio_noche: true,
          habitacion: {
            select: {
              tipo: true,
              precio_base: true,
              hostal: {
                select: {
                  id_hostal: true,
                  nombre: true,
                  ciudad: { select: { nombre: true } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { fecha_reserva: "desc" },
  });
};

const completarReserva = async (id_reserva, id_usuario) => {
  const reserva = await prisma.reserva.findUnique({ where: { id_reserva } });

  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  if (reserva.id_usuario !== id_usuario)
    throw new AppError("No autorizado", 403);
  if (reserva.estado === "completada")
    throw new AppError("La reserva ya está completada", 400);
  if (reserva.estado === "cancelada")
    throw new AppError("No se puede completar una reserva cancelada", 400);
  if (new Date(reserva.fecha_fin) > new Date())
    throw new AppError("La reserva aún no ha finalizado", 400);

  return await prisma.reserva.update({
    where: { id_reserva },
    data: { estado: "completada" },
    select: { id_reserva: true, estado: true, total: true },
  });
};

const getReservaById = async (id_reserva, id_usuario) => {
  const reserva = await prisma.reserva.findUnique({
    where: { id_reserva },
    select: {
      id_reserva: true,
      estado: true,
      total: true,
      fecha_inicio: true,
      fecha_fin: true,
      fecha_reserva: true,
      num_personas: true,
      habitaciones: {
        select: {
          precio_noche: true,
          habitacion: {
            select: {
              tipo: true,
              descripcion: true,
              capacidad: true,
              precio_base: true,
              hostal: {
                select: {
                  nombre: true,
                  telefono: true,
                  ciudad: { select: { nombre: true } },
                },
              },
            },
          },
        },
      },
      facturas: {
        select: {
          id_factura: true,
          estado: true,
          subtotal: true,
          impuestos: true,
          total: true,
          fecha_emision: true,
        },
      },
    },
  });

  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  if (reserva.id_usuario !== id_usuario)
    throw new AppError("No autorizado", 403);

  return reserva;
};

const confirmarReserva = async (id_reserva, id_usuario) => {
  const reserva = await prisma.reserva.findUnique({
    where: { id_reserva },
  });

  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  if (reserva.id_usuario !== id_usuario)
    throw new AppError("No autorizado", 403);
  if (reserva.estado === "confirmada")
    throw new AppError("La reserva ya está confirmada", 400);
  if (reserva.estado === "cancelada")
    throw new AppError("No se puede confirmar una reserva cancelada", 400);

  const updated = await prisma.reserva.update({
    where: { id_reserva },
    data: { estado: "confirmada" },
    select: {
      id_reserva: true,
      estado: true,
      total: true,
      fecha_reserva: true,
    },
  });

  // Unirse a chats automáticamente
  await unirseAChatsDeReserva(id_reserva, id_usuario);
  await actualizarPaisesVisitados(id_reserva, id_usuario);

  return updated;
};

module.exports = {
  createReserva,
  getMyReservas,
  getReservaById,
  confirmarReserva,
  completarReserva,
};
