const prisma = require("../src/config/prisma");

async function main() {
  console.log("🌍 Actualizando coordenadas...");

  const coords = [
    // id_direccion 1 → Mad4You Hostel, Madrid
    { id: 1, latitud: 40.4168, longitud: -3.7038 },
    // id_direccion 2 → The Hat Madrid
    { id: 2, latitud: 40.4155, longitud: -3.7074 },
    // id_direccion 3 → Steel House Barcelona
    { id: 3, latitud: 41.3851, longitud: 2.1734 },
    // id_direccion 4 → Casa Gracia Barcelona
    { id: 4, latitud: 41.3947, longitud: 2.162 },
    // id_direccion 5 → Generator Paris
    { id: 5, latitud: 48.8698, longitud: 2.3626 },
    // id_direccion 6 → St Christopher's Paris
    { id: 6, latitud: 48.853, longitud: 2.3499 },
    // id_direccion 7 → Generator London
    { id: 7, latitud: 51.5227, longitud: -0.1254 },
    // id_direccion 8 → Clink78 London
    { id: 8, latitud: 51.5362, longitud: -0.1096 },
    // id_direccion 9 → The Yellow Rome
    { id: 9, latitud: 41.9028, longitud: 12.4964 },
    // id_direccion 10 → Alessandro Palace Rome
    { id: 10, latitud: 41.9109, longitud: 12.5153 },
  ];

  for (const c of coords) {
    await prisma.direccion.update({
      where: { id_direccion: c.id },
      data: { latitud: c.latitud, longitud: c.longitud },
    });
  }

  console.log("✅ Coordenadas actualizadas");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
