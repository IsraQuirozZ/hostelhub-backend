const prisma = require("../src/config/prisma");

async function main() {
  console.log("🌱 Actualizando ratings con contenido...");

  const ratings = [
    {
      id_hostal: 1,
      id_usuario: 1,
      puntuacion: 5,
      contenido:
        "Ubicación perfecta, el personal fue muy amable y las instalaciones estaban impecables. Totalmente recomendable.",
    },
    {
      id_hostal: 2,
      id_usuario: 1,
      puntuacion: 4,
      contenido:
        "Las vistas desde la terraza son increíbles. El ambiente es muy bueno aunque algo ruidoso por las noches.",
    },
    {
      id_hostal: 3,
      id_usuario: 1,
      puntuacion: 4,
      contenido:
        "Diseño moderno y muy limpio. Bien comunicado con el metro. Lo repetiría sin dudarlo.",
    },
    {
      id_hostal: 4,
      id_usuario: 1,
      puntuacion: 5,
      contenido:
        "Un hostel boutique con mucho encanto. El desayuno estaba delicioso y el personal muy atento.",
    },
    {
      id_hostal: 5,
      id_usuario: 1,
      puntuacion: 3,
      contenido:
        "Correcto pero nada especial. Las camas son cómodas pero el baño compartido deja algo que desear.",
    },
    {
      id_hostal: 6,
      id_usuario: 1,
      puntuacion: 4,
      contenido:
        "Ambiente muy animado y social. Perfecto para conocer gente. Las orillas del Sena están a cinco minutos.",
    },
    {
      id_hostal: 7,
      id_usuario: 1,
      puntuacion: 5,
      contenido:
        "El mejor hostel en el que he estado. Todo perfecto, desde la ubicación hasta el personal.",
    },
    {
      id_hostal: 8,
      id_usuario: 1,
      puntuacion: 4,
      contenido:
        "Historia curiosa la del edificio. Muy bien situado en Londres y con buen ambiente.",
    },
    {
      id_hostal: 9,
      id_usuario: 1,
      puntuacion: 4,
      contenido:
        "La terraza es espectacular con vistas a Roma. Ambiente joven y muy buena vibra.",
    },
    {
      id_hostal: 10,
      id_usuario: 1,
      puntuacion: 3,
      contenido:
        "Familiar y acogedor. Las instalaciones son básicas pero limpias y el precio es justo.",
    },
  ];

  for (const r of ratings) {
    await prisma.ratingHostal.upsert({
      where: {
        id_hostal_id_usuario: {
          id_hostal: r.id_hostal,
          id_usuario: r.id_usuario,
        },
      },
      update: { puntuacion: r.puntuacion, contenido: r.contenido },
      create: r,
    });
  }

  console.log("✅ Ratings actualizados");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
