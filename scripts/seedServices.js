const prisma = require("../src/config/prisma");

async function main() {
  console.log("🌱 Creando servicios y habitaciones...");

  // Servicios con iconos (nombres de iconos de Ionicons)
  const servicios = await Promise.all([
    prisma.servicio.upsert({
      where: { id_servicio: 1 },
      update: {},
      create: { nombre: "WiFi", icono: "wifi-outline" },
    }),
    prisma.servicio.upsert({
      where: { id_servicio: 2 },
      update: {},
      create: { nombre: "Cocina", icono: "restaurant-outline" },
    }),
    prisma.servicio.upsert({
      where: { id_servicio: 3 },
      update: {},
      create: { nombre: "Lavandería", icono: "shirt-outline" },
    }),
    prisma.servicio.upsert({
      where: { id_servicio: 4 },
      update: {},
      create: { nombre: "Bar", icono: "beer-outline" },
    }),
    prisma.servicio.upsert({
      where: { id_servicio: 5 },
      update: {},
      create: { nombre: "Aire acondicionado", icono: "snow-outline" },
    }),
    prisma.servicio.upsert({
      where: { id_servicio: 6 },
      update: {},
      create: { nombre: "Taquillas", icono: "lock-closed-outline" },
    }),
    prisma.servicio.upsert({
      where: { id_servicio: 7 },
      update: {},
      create: { nombre: "Recepción 24h", icono: "time-outline" },
    }),
    prisma.servicio.upsert({
      where: { id_servicio: 8 },
      update: {},
      create: { nombre: "Terraza", icono: "sunny-outline" },
    }),
  ]);

  console.log("✅ Servicios creados");

  // Habitaciones por hostal (precio_base en €)
  const habitaciones = [
    // Madrid
    {
      id_hostal: 1,
      tipo: "Dormitorio compartido",
      capacidad: 8,
      precio_base: 18,
    },
    { id_hostal: 1, tipo: "Habitación privada", capacidad: 2, precio_base: 45 },
    {
      id_hostal: 2,
      tipo: "Dormitorio compartido",
      capacidad: 6,
      precio_base: 22,
    },
    { id_hostal: 2, tipo: "Habitación privada", capacidad: 2, precio_base: 55 },
    // Barcelona
    {
      id_hostal: 3,
      tipo: "Dormitorio compartido",
      capacidad: 10,
      precio_base: 20,
    },
    { id_hostal: 3, tipo: "Habitación privada", capacidad: 2, precio_base: 60 },
    {
      id_hostal: 4,
      tipo: "Dormitorio compartido",
      capacidad: 6,
      precio_base: 25,
    },
    { id_hostal: 4, tipo: "Habitación privada", capacidad: 2, precio_base: 70 },
    // París
    {
      id_hostal: 5,
      tipo: "Dormitorio compartido",
      capacidad: 8,
      precio_base: 28,
    },
    { id_hostal: 5, tipo: "Habitación privada", capacidad: 2, precio_base: 75 },
    {
      id_hostal: 6,
      tipo: "Dormitorio compartido",
      capacidad: 6,
      precio_base: 25,
    },
    // Londres
    {
      id_hostal: 7,
      tipo: "Dormitorio compartido",
      capacidad: 12,
      precio_base: 30,
    },
    { id_hostal: 7, tipo: "Habitación privada", capacidad: 2, precio_base: 80 },
    {
      id_hostal: 8,
      tipo: "Dormitorio compartido",
      capacidad: 8,
      precio_base: 28,
    },
    // Roma
    {
      id_hostal: 9,
      tipo: "Dormitorio compartido",
      capacidad: 6,
      precio_base: 22,
    },
    { id_hostal: 9, tipo: "Habitación privada", capacidad: 2, precio_base: 55 },
    {
      id_hostal: 10,
      tipo: "Dormitorio compartido",
      capacidad: 8,
      precio_base: 20,
    },
  ];

  for (const h of habitaciones) {
    await prisma.habitacion.create({ data: h });
  }

  console.log("✅ Habitaciones creadas");

  // Asignar servicios a hostales
  const asignaciones = [
    { id_hostal: 1, servicios: [1, 2, 3, 6, 7] },
    { id_hostal: 2, servicios: [1, 4, 6, 7, 8] },
    { id_hostal: 3, servicios: [1, 2, 4, 5, 6] },
    { id_hostal: 4, servicios: [1, 2, 3, 5, 7, 8] },
    { id_hostal: 5, servicios: [1, 4, 6, 7] },
    { id_hostal: 6, servicios: [1, 2, 3, 6] },
    { id_hostal: 7, servicios: [1, 2, 4, 5, 6, 7] },
    { id_hostal: 8, servicios: [1, 3, 6, 7, 8] },
    { id_hostal: 9, servicios: [1, 2, 4, 8] },
    { id_hostal: 10, servicios: [1, 2, 3, 5, 6, 7] },
  ];

  for (const a of asignaciones) {
    for (const id_servicio of a.servicios) {
      await prisma.hostalServicio.upsert({
        where: {
          id_hostal_id_servicio: { id_hostal: a.id_hostal, id_servicio },
        },
        update: {},
        create: { id_hostal: a.id_hostal, id_servicio },
      });
    }
  }

  console.log("✅ Servicios asignados a hostales");
  console.log("🎉 Todo listo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
