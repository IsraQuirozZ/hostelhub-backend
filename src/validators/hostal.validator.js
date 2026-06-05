const { z } = require("zod");

const createReviewSchema = z.object({
  puntuacion: z.number().min(1, "Mínimo 1").max(5, "Máximo 5"),
  contenido: z.string().min(10, "La review debe tener al menos 10 caracteres"),
});

module.exports = { createReviewSchema };
