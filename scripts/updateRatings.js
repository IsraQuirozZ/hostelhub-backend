const prisma = require("../src/config/prisma");

async function main() {
  const ratings = [
    { id_hostal: 1, promedio_rating: 4.5 },
    { id_hostal: 2, promedio_rating: 4.8 },
    { id_hostal: 3, promedio_rating: 4.2 },
    { id_hostal: 4, promedio_rating: 4.7 },
    { id_hostal: 5, promedio_rating: 4.1 },
    { id_hostal: 6, promedio_rating: 4.6 },
    { id_hostal: 7, promedio_rating: 4.9 },
    { id_hostal: 8, promedio_rating: 4.3 },
    { id_hostal: 9, promedio_rating: 4.4 },
    { id_hostal: 10, promedio_rating: 4.0 },
  ];

  for (const r of ratings) {
    await prisma.hostal.update({
      where: { id_hostal: r.id_hostal },
      data: { promedio_rating: r.promedio_rating },
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
