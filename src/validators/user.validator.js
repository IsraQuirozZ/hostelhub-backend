const { z } = require("zod");

const updateUserSchema = z.object({
  nombre: z.string().min(2).optional(),
  sobre_mi: z.string().optional(),
  nacionalidad: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

const addLanguageSchema = z.object({
  codigo_iso: z.string().min(2).max(3),
  nivel: z.enum(["basico", "intermedio", "avanzado", "nativo"]),
});

module.exports = { updateUserSchema, updatePasswordSchema, addLanguageSchema };
