const prisma = require("../src/config/prisma");

async function main() {
  console.log("🌱 Creando posts de prueba...");

  const user = await prisma.usuario.findFirst({
    select: { id_usuario: true },
    orderBy: { id_usuario: "asc" },
  });

  if (!user) {
    throw new Error(
      "No hay usuarios para asociar posts. Crea un usuario antes de seed-posts.",
    );
  }

  const cities = await prisma.ciudad.findMany({
    select: { id_ciudad: true, nombre: true },
  });
  const cityIdByName = new Map(cities.map((c) => [c.nombre, c.id_ciudad]));

  const posts = [
    {
      cityName: "Madrid",
      titulo: "Madrid en 3 días",
      contenido:
        "Madrid es una ciudad que nunca duerme. El Retiro, el Prado, la Gran Vía... imposible aburrirse. Os recomiendo perderos por Malasaña por las noches.",
      nombre_lugar: "Parque del Retiro",
      foto_url:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
    },
    {
      cityName: "Barcelona",
      titulo: "Barcelona: más que Gaudí",
      contenido:
        "Todo el mundo viene a ver la Sagrada Familia pero Barcelona tiene mucho más. El barrio de Gràcia, el mercado de Santa Caterina, la playa de la Barceloneta...",
      nombre_lugar: "Barrio de Gràcia",
      foto_url:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
    },
    {
      cityName: "Paris",
      titulo: "París con poco presupuesto",
      contenido:
        "París no tiene por qué ser caro. Los museos nacionales son gratuitos el primer domingo de mes, los picnics en el Sena son una delicia y el metro te lleva a todos lados.",
      nombre_lugar: "Orillas del Sena",
      foto_url:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    },
    {
      cityName: "Londres",
      titulo: "Londres: consejos que nadie te cuenta",
      contenido:
        "Los museos de Londres son gratuitos, algo que mucha gente no sabe. El British Museum, la National Gallery, el Natural History Museum... días enteros de plan sin gastar nada.",
      nombre_lugar: "British Museum",
      foto_url: null,
    },
    {
      cityName: "Roma",
      titulo: "Roma en moto de agua",
      contenido:
        "La mejor forma de ver Roma es alquilar una Vespa y perderte por sus calles. Evita el Coliseo a mediodía y ve temprano, la diferencia es brutal.",
      nombre_lugar: "Coliseo Romano",
      foto_url:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
    },
    {
      cityName: "Madrid",
      titulo: "El mejor barrio para alojarse en Madrid",
      contenido:
        "Después de probar varios barrios me quedo con Lavapiés. Diverso, auténtico, lleno de bares de tapas y muy bien comunicado. Los hosteles aquí son también más baratos.",
      nombre_lugar: "Lavapiés, Madrid",
      foto_url: null,
    },
    {
      cityName: "Barcelona",
      titulo: "Tapas y pintxos en Barcelona",
      contenido:
        "El Born es el barrio perfecto para comer bien sin arruinarse. Los pintxos del mercado de Santa Caterina son impresionantes y la zona tiene una energía increíble.",
      nombre_lugar: "El Born, Barcelona",
      foto_url:
        "https://images.unsplash.com/photo-1559564484-1b9a5e52d7e7?w=800",
    },
  ];

  for (const post of posts) {
    const cityId = cityIdByName.get(post.cityName);
    if (!cityId) {
      throw new Error(
        `No existe la ciudad '${post.cityName}' para crear posts`,
      );
    }

    const { cityName, ...rest } = post;
    await prisma.post.create({
      data: {
        ...rest,
        id_usuario: user.id_usuario,
        id_ciudad: cityId,
      },
    });
  }

  console.log(`✅ ${posts.length} posts creados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
