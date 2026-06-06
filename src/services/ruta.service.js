const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateRuta = async (id_reserva, id_usuario) => {
  // Si ya existe devolver la existente
  const existing = await prisma.ruta.findUnique({ where: { id_reserva } });
  if (existing) return existing;

  // Obtener reserva con hostal y ciudad
  const reserva = await prisma.reserva.findUnique({
    where: { id_reserva },
    include: {
      habitaciones: {
        include: {
          habitacion: {
            include: {
              hostal: {
                include: { ciudad: true },
              },
            },
          },
        },
      },
    },
  });

  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  if (reserva.id_usuario !== id_usuario)
    throw new AppError("No autorizado", 403);

  const hostal = reserva.habitaciones[0]?.habitacion?.hostal;
  const ciudad = hostal?.ciudad;
  if (!hostal || !ciudad)
    throw new AppError("No se pudo obtener el hostal o ciudad", 404);

  // Calcular días de estancia
  const inicio = new Date(reserva.fecha_inicio);
  const fin = new Date(reserva.fecha_fin);
  const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));

  // Obtener posts mejor valorados de esa ciudad
  const posts = await prisma.post.findMany({
    where: { id_ciudad: ciudad.id_ciudad, estado: "activo" },
    select: { titulo: true, nombre_lugar: true, promedio_rating: true },
    orderBy: { promedio_rating: "desc" },
    take: 5,
  });

  const listaPosts =
    posts.length > 0
      ? posts
          .map(
            (p) =>
              `- ${p.nombre_lugar || p.titulo} (rating: ${p.promedio_rating})`,
          )
          .join("\n")
      : "No hay lugares recomendados por viajeros aún.";

  // Llamar a OpenAI
  const prompt = `Eres un experto en turismo. Genera una ruta de ${dias} día(s) para un viajero que se aloja en ${hostal.nombre} en ${ciudad.nombre}.
Los siguientes lugares han sido recomendados por otros viajeros en la app:
${listaPosts}
La ruta debe:
- Empezar y terminar en el hostal
- Incluir entre 4 y 6 paradas
- Ser geográficamente coherente
- Mezclar lugares de la app con atracciones reconocidas de ${ciudad.nombre}
Responde SOLO en JSON con este formato exacto, sin texto adicional:
{
  "paradas": [
    {
      "orden": 1,
      "nombre": "nombre del lugar",
      "descripcion": "descripción breve de 1-2 frases",
      "tipo": "hostal|museo|restaurante|parque|monumento|barrio|otro",
      "es_de_app": true
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let paradas;
  try {
    const content = response.choices[0].message.content.trim();
    const clean = content.replace(/```json|```/g, "").trim();
    paradas = JSON.parse(clean).paradas;
  } catch {
    throw new AppError("Error al procesar la respuesta de OpenAI", 500);
  }

  // Guardar en BD
  const ruta = await prisma.ruta.create({
    data: {
      id_reserva,
      id_usuario,
      ciudad: ciudad.nombre,
      paradas,
    },
  });

  return ruta;
};

const getRutaByReserva = async (id_reserva, id_usuario) => {
  const ruta = await prisma.ruta.findUnique({ where: { id_reserva } });
  if (!ruta) throw new AppError("Ruta no encontrada", 404);
  if (ruta.id_usuario !== id_usuario) throw new AppError("No autorizado", 403);
  return ruta;
};

module.exports = { generateRuta, getRutaByReserva };
