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

  // Ciudades: resolver por nombre + país para no depender de IDs fijos
  const citySeeds = [
    { nombre: "Madrid", codigo_pais: "ES" },
    { nombre: "Barcelona", codigo_pais: "ES" },
    { nombre: "Paris", codigo_pais: "FR" },
    { nombre: "Londres", codigo_pais: "GB" },
    { nombre: "Roma", codigo_pais: "IT" },
  ];

  const ciudades = [];
  for (const city of citySeeds) {
    const existing = await prisma.ciudad.findFirst({
      where: { nombre: city.nombre, codigo_pais: city.codigo_pais },
      select: { id_ciudad: true, nombre: true, codigo_pais: true },
    });

    if (existing) {
      ciudades.push(existing);
      continue;
    }

    const created = await prisma.ciudad.create({
      data: city,
      select: { id_ciudad: true, nombre: true, codigo_pais: true },
    });
    ciudades.push(created);
  }

  const cityIdByName = new Map(ciudades.map((c) => [c.nombre, c.id_ciudad]));

  console.log("✅ Ciudades creadas");

  // Direcciones y hostales
  const hostalesData = [
    {
      ciudad: "Madrid",
      nombre: "Mad4You Hostel",
      descripcion: "Hostel céntrico en el corazón de Madrid",
      telefono: "+34 910 000 001",
      capacidad: 80,
    },
    {
      ciudad: "Madrid",
      nombre: "The Hat Madrid",
      descripcion: "Vistas únicas al centro histórico de Madrid",
      telefono: "+34 910 000 002",
      capacidad: 120,
    },
    {
      ciudad: "Barcelona",
      nombre: "Steel House Barcelona",
      descripcion: "Diseño moderno y ambiente cosmopolita",
      telefono: "+34 930 000 001",
      capacidad: 100,
    },
    {
      ciudad: "Barcelona",
      nombre: "Casa Gracia Barcelona",
      descripcion: "Boutique hostel en el Eixample",
      telefono: "+34 930 000 002",
      capacidad: 60,
    },
    {
      ciudad: "Paris",
      nombre: "Generator Paris",
      descripcion: "Hostel moderno cerca del Canal Saint-Martin",
      telefono: "+33 100 000 001",
      capacidad: 150,
    },
    {
      ciudad: "Paris",
      nombre: "St Christopher's Paris",
      descripcion: "Ambiente animado a orillas del Sena",
      telefono: "+33 100 000 002",
      capacidad: 90,
    },
    {
      ciudad: "Londres",
      nombre: "Generator London",
      descripcion: "Hostel icónico en Bloomsbury, Londres",
      telefono: "+44 200 000 001",
      capacidad: 200,
    },
    {
      ciudad: "Londres",
      nombre: "Clink78",
      descripcion: "Histórica prisión convertida en hostel",
      telefono: "+44 200 000 002",
      capacidad: 110,
    },
    {
      ciudad: "Roma",
      nombre: "The Yellow Rome",
      descripcion: "Hostel con terraza y ambiente joven",
      telefono: "+39 600 000 001",
      capacidad: 70,
    },
    {
      ciudad: "Roma",
      nombre: "Alessandro Palace",
      descripcion: "Hostel familiar con gran ambiente social",
      telefono: "+39 600 000 002",
      capacidad: 85,
    },
  ];

  for (const h of hostalesData) {
    const cityId = cityIdByName.get(h.ciudad);
    if (!cityId) {
      throw new Error(
        `No se encontró la ciudad '${h.ciudad}' al crear hostales`,
      );
    }

    const direccion = await prisma.direccion.create({
      data: { calle: "Calle Principal", codigo_postal: "00000", numero: "1" },
    });

    await prisma.hostal.create({
      data: {
        id_direccion: direccion.id_direccion,
        id_ciudad: cityId,
        nombre: h.nombre,
        descripcion: h.descripcion,
        telefono: h.telefono,
        capacidad: h.capacidad,
        disponibilidad: true,
        promedio_rating: 0,
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
