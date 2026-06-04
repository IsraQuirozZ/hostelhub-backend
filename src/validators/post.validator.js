const { z } = require("zod");

const createPostSchema = z
  .object({
    titulo: z.string().min(1, "El título es obligatorio"),
    contenido: z.string().min(1, "El contenido es obligatorio"),
    id_ciudad: z.number().int().positive().optional(),
    nombre_ciudad: z.string().min(1).optional(),
    nombre_lugar: z.string().optional(),
    foto_url: z.string().url("URL de foto inválida").optional(),
    promedio_rating: z
      .number()
      .min(0)
      .max(5, "El rating debe estar entre 0 y 5")
      .optional(),
  })
  .refine((data) => data.id_ciudad || data.nombre_ciudad, {
    message: "Debes proporcionar id_ciudad o nombre_ciudad",
  });

const updatePostSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio").optional(),
  contenido: z.string().min(1, "El contenido es obligatorio").optional(),
  nombre_lugar: z.string().optional(),
  foto_url: z.string().url("URL de foto inválida").optional(),
  promedio_rating: z
    .number()
    .min(0, "El rating debe estar entre 0 y 5")
    .max(5, "El rating debe estar entre 0 y 5")
    .optional(),
});

module.exports = { createPostSchema, updatePostSchema };
