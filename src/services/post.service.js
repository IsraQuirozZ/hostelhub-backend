const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const getAllPosts = async () => {
  return await prisma.post.findMany({
    where: { estado: "activo" },
    include: {
      usuario: { select: { id_usuario: true, nombre: true } },
      ciudad: { select: { id_ciudad: true, nombre: true } },
      _count: { select: { comentarios: true, ratings: true } },
    },
    orderBy: { fecha_publicacion: "desc" },
  });
};

const getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id_post: id },
    include: {
      usuario: { select: { id_usuario: true, nombre: true } },
      ciudad: { select: { id_ciudad: true, nombre: true } },
      comentarios: {
        include: { usuario: { select: { id_usuario: true, nombre: true } } },
        orderBy: { fecha_comentario: "desc" },
      },
      ratings: true,
    },
  });

  if (!post) throw new AppError("Post no encontrado", 404);
  return post;
};

const createPost = async (id_usuario, data) => {
  return await prisma.post.create({
    data: {
      ...data,
      id_usuario,
    },
  });
};

const updatePost = async (id_post, id_usuario, data) => {
  const post = await prisma.post.findUnique({ where: { id_post } });
  if (!post) throw new AppError("Post no encontrado", 404);
  if (post.id_usuario !== id_usuario) throw new AppError("No autorizado", 403);

  return await prisma.post.update({
    where: { id_post },
    data,
  });
};

const deletePost = async (id_post, id_usuario) => {
  const post = await prisma.post.findUnique({ where: { id_post } });
  if (!post) throw new AppError("Post no encontrado", 404);
  if (post.id_usuario !== id_usuario) throw new AppError("No autorizado", 403);

  await prisma.post.update({
    where: { id_post },
    data: { estado: "inactivo" },
  });
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
