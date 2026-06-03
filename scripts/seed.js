const prisma = require("../src/config/prisma");

async function main() {
  console.log("🌱 Seeding...");

  // Países
  await prisma.pais.createMany({
    data: [
      { codigo_pais: "ES", nombre: "España" },
      { codigo_pais: "FR", nombre: "Francia" },
      { codigo_pais: "GB", nombre: "Reino Unido" },
      { codigo_pais: "IT", nombre: "Italia" },
    ],
    skipDuplicates: true,
  });

  // Ciudades
  const ciudades = await Promise.all([
    prisma.ciudad.upsert({
      where: { id_ciudad: 1 },
      update: {},
      create: { nombre: "Madrid", codigo_pais: "ES" },
    }),
    prisma.ciudad.upsert({
      where: { id_ciudad: 2 },
      update: {},
      create: { nombre: "Barcelona", codigo_pais: "ES" },
    }),
    prisma.ciudad.upsert({
      where: { id_ciudad: 3 },
      update: {},
      create: { nombre: "París", codigo_pais: "FR" },
    }),
    prisma.ciudad.upsert({
      where: { id_ciudad: 4 },
      update: {},
      create: { nombre: "Londres", codigo_pais: "GB" },
    }),
    prisma.ciudad.upsert({
      where: { id_ciudad: 5 },
      update: {},
      create: { nombre: "Roma", codigo_pais: "IT" },
    }),
  ]);

  console.log("✅ Ciudades creadas");

  // Direcciones y hostales
  const hostalesData = [
    {
      ciudad: 1,
      nombre: "Mad4You Hostel",
      descripcion: "Hostel céntrico en el corazón de Madrid",
      telefono: "+34 910 000 001",
      capacidad: 80,
    },
    {
      ciudad: 1,
      nombre: "The Hat Madrid",
      descripcion: "Vistas únicas al centro histórico de Madrid",
      telefono: "+34 910 000 002",
      capacidad: 120,
    },
    {
      ciudad: 2,
      nombre: "Steel House Barcelona",
      descripcion: "Diseño moderno y ambiente cosmopolita",
      telefono: "+34 930 000 001",
      capacidad: 100,
    },
    {
      ciudad: 2,
      nombre: "Casa Gracia Barcelona",
      descripcion: "Boutique hostel en el Eixample",
      telefono: "+34 930 000 002",
      capacidad: 60,
    },
    {
      ciudad: 3,
      nombre: "Generator Paris",
      descripcion: "Hostel moderno cerca del Canal Saint-Martin",
      telefono: "+33 100 000 001",
      capacidad: 150,
    },
    {
      ciudad: 3,
      nombre: "St Christopher's Paris",
      descripcion: "Ambiente animado a orillas del Sena",
      telefono: "+33 100 000 002",
      capacidad: 90,
    },
    {
      ciudad: 4,
      nombre: "Generator London",
      descripcion: "Hostel icónico en Bloomsbury, Londres",
      telefono: "+44 200 000 001",
      capacidad: 200,
    },
    {
      ciudad: 4,
      nombre: "Clink78",
      descripcion: "Histórica prisión convertida en hostel",
      telefono: "+44 200 000 002",
      capacidad: 110,
    },
    {
      ciudad: 5,
      nombre: "The Yellow Rome",
      descripcion: "Hostel con terraza y ambiente joven",
      telefono: "+39 600 000 001",
      capacidad: 70,
    },
    {
      ciudad: 5,
      nombre: "Alessandro Palace",
      descripcion: "Hostel familiar con gran ambiente social",
      telefono: "+39 600 000 002",
      capacidad: 85,
    },
  ];

  for (const h of hostalesData) {
    const direccion = await prisma.direccion.create({
      data: { calle: "Calle Principal", codigo_postal: "00000", numero: "1" },
    });

    await prisma.hostal.create({
      data: {
        id_direccion: direccion.id_direccion,
        id_ciudad: h.ciudad,
        nombre: h.nombre,
        descripcion: h.descripcion,
        telefono: h.telefono,
        capacidad: h.capacidad,
        disponibilidad: true,
      },
    });
  }

  console.log("✅ Hostales creados");
  console.log("🎉 Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
