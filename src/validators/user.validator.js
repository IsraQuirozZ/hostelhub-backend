const { z } = require("zod");

const updateUserSchema = z.object({
  nombre: z.string().min(2).optional(),
  sobre_mi: z.string().optional(),
  nacionalidad: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
});

module.exports = { updateUserSchema };
