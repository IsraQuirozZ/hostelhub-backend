const { z } = require("zod");

const createReservaSchema = z
  .object({
    id_habitacion: z.number().int().positive(),
    fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fecha_fin: z.string().min(1, "La fecha de fin es obligatoria"),
    num_personas: z
      .number()
      .int()
      .positive("El número de personas debe ser mayor a 0"),
  })
  .refine((data) => new Date(data.fecha_fin) > new Date(data.fecha_inicio), {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
  });

module.exports = { createReservaSchema };
