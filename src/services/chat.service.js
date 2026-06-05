const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

// Busca o crea un chat de hostal/ciudad
const findOrCreateChat = async (tx, { tipo_chat, id_hostal, id_ciudad }) => {
  const where =
    tipo_chat === "hostal" ? { id_hostal } : { id_ciudad, id_hostal: null };

  let chat = await tx.chat.findFirst({ where: { tipo_chat, ...where } });

  if (!chat) {
    chat = await tx.chat.create({
      data: { tipo_chat, ...where },
    });
  }

  return chat;
};

// Une al usuario a un chat si no está ya unido
const joinChat = async (tx, id_usuario, id_chat) => {
  const existing = await tx.usuarioChat.findUnique({
    where: { id_usuario_id_chat: { id_usuario, id_chat } },
  });

  if (!existing) {
    await tx.usuarioChat.create({
      data: { id_usuario, id_chat },
    });
  }
};

// Llamado al confirmar reserva
const unirseAChatsDeReserva = async (id_reserva, id_usuario) => {
  await prisma.$transaction(async (tx) => {
    // Obtener habitación → hostal → ciudad de la reserva
    const reserva = await tx.reserva.findUnique({
      where: { id_reserva },
      include: {
        habitaciones: {
          include: {
            habitacion: {
              include: {
                hostal: { include: { ciudad: true } },
              },
            },
          },
        },
      },
    });

    if (!reserva) throw new AppError("Reserva no encontrada", 404);

    const habitacion = reserva.habitaciones[0]?.habitacion;
    if (!habitacion)
      throw new AppError("No se encontró habitación en la reserva", 404);

    const hostal = habitacion.hostal;
    const ciudad = hostal.ciudad;

    // Chat del hostal
    const chatHostal = await findOrCreateChat(tx, {
      tipo_chat: "hostal",
      id_hostal: hostal.id_hostal,
      id_ciudad: null,
    });
    await joinChat(tx, id_usuario, chatHostal.id_chat);

    // Chat de la ciudad
    const chatCiudad = await findOrCreateChat(tx, {
      tipo_chat: "ciudad",
      id_hostal: null,
      id_ciudad: ciudad.id_ciudad,
    });
    await joinChat(tx, id_usuario, chatCiudad.id_chat);
  });
};

const getMyChats = async (id_usuario) => {
  return await prisma.usuarioChat.findMany({
    where: { id_usuario },
    select: {
      fecha_union: true,
      chat: {
        select: {
          id_chat: true,
          tipo_chat: true,
          fecha_creacion: true,
          hostal: { select: { id_hostal: true, nombre: true } },
          ciudad: { select: { id_ciudad: true, nombre: true } },
          mensajes: {
            orderBy: { fecha_envio: "desc" },
            take: 1,
            select: {
              contenido: true,
              fecha_envio: true,
              usuario: { select: { nombre: true } },
            },
          },
        },
      },
    },
    orderBy: { fecha_union: "desc" },
  });
};

const getChatMessages = async (id_chat, id_usuario) => {
  // Verificar que el usuario pertenece al chat
  const membership = await prisma.usuarioChat.findUnique({
    where: { id_usuario_id_chat: { id_usuario, id_chat } },
  });
  if (!membership) throw new AppError("No tienes acceso a este chat", 403);

  return await prisma.mensaje.findMany({
    where: { id_chat },
    select: {
      id_mensaje: true,
      contenido: true,
      fecha_envio: true,
      usuario: { select: { id_usuario: true, nombre: true } },
    },
    orderBy: { fecha_envio: "asc" },
  });
};

const sendMessage = async (id_chat, id_usuario, contenido) => {
  // Verificar que el usuario pertenece al chat
  const membership = await prisma.usuarioChat.findUnique({
    where: { id_usuario_id_chat: { id_usuario, id_chat } },
  });
  if (!membership) throw new AppError("No tienes acceso a este chat", 403);

  return await prisma.mensaje.create({
    data: { id_chat, id_usuario, contenido },
    select: {
      id_mensaje: true,
      contenido: true,
      fecha_envio: true,
      usuario: { select: { id_usuario: true, nombre: true } },
    },
  });
};

module.exports = {
  unirseAChatsDeReserva,
  getMyChats,
  getChatMessages,
  sendMessage,
};
