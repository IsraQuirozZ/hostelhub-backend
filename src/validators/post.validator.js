const { z } = require("zod");

const createPostSchema = z.object({
  titulo: z.string().min(3),
  contenido: z.string().min(10),
  id_ciudad: z.number().int().positive(),
  nombre_lugar: z.string().optional(),
});

const updatePostSchema = z.object({
  titulo: z.string().min(3).optional(),
  contenido: z.string().min(10).optional(),
  nombre_lugar: z.string().optional(),
});

module.exports = { createPostSchema, updatePostSchema };
