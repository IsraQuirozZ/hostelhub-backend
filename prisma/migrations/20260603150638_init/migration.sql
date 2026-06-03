-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3),
    "sobre_mi" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nacionalidad" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "idiomas" (
    "codigo_iso" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "idiomas_pkey" PRIMARY KEY ("codigo_iso")
);

-- CreateTable
CREATE TABLE "usuario_idioma" (
    "id_usuario" INTEGER NOT NULL,
    "codigo_iso" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,

    CONSTRAINT "usuario_idioma_pkey" PRIMARY KEY ("id_usuario","codigo_iso")
);

-- CreateTable
CREATE TABLE "paises" (
    "codigo_pais" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("codigo_pais")
);

-- CreateTable
CREATE TABLE "ciudades" (
    "id_ciudad" SERIAL NOT NULL,
    "codigo_pais" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "ciudades_pkey" PRIMARY KEY ("id_ciudad")
);

-- CreateTable
CREATE TABLE "usuario_paises" (
    "id_usuario" INTEGER NOT NULL,
    "codigo_pais" TEXT NOT NULL,
    "visitas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "usuario_paises_pkey" PRIMARY KEY ("id_usuario","codigo_pais")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id_reserva" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "fecha_reserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "num_personas" INTEGER NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id_factura" SERIAL NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "impuestos" DECIMAL(10,2) NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id_pago" SERIAL NOT NULL,
    "id_factura" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "tipo_pago" TEXT NOT NULL,
    "metodo_pago" TEXT NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id_direccion" SERIAL NOT NULL,
    "calle" TEXT NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "numero" TEXT NOT NULL,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id_direccion")
);

-- CreateTable
CREATE TABLE "hostales" (
    "id_hostal" SERIAL NOT NULL,
    "id_direccion" INTEGER NOT NULL,
    "id_ciudad" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "telefono" TEXT,
    "disponibilidad" BOOLEAN NOT NULL DEFAULT true,
    "capacidad" INTEGER NOT NULL,
    "email" TEXT,

    CONSTRAINT "hostales_pkey" PRIMARY KEY ("id_hostal")
);

-- CreateTable
CREATE TABLE "habitaciones" (
    "id_habitacion" SERIAL NOT NULL,
    "id_hostal" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT,
    "disponibilidad" BOOLEAN NOT NULL DEFAULT true,
    "capacidad" INTEGER NOT NULL,

    CONSTRAINT "habitaciones_pkey" PRIMARY KEY ("id_habitacion")
);

-- CreateTable
CREATE TABLE "reserva_habitacion" (
    "id_reserva" INTEGER NOT NULL,
    "id_habitacion" INTEGER NOT NULL,
    "precio_noche" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "reserva_habitacion_pkey" PRIMARY KEY ("id_reserva","id_habitacion")
);

-- CreateTable
CREATE TABLE "fotos" (
    "id_foto" SERIAL NOT NULL,
    "ruta" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "fotos_pkey" PRIMARY KEY ("id_foto")
);

-- CreateTable
CREATE TABLE "hostal_foto" (
    "id_foto" INTEGER NOT NULL,
    "id_hostal" INTEGER NOT NULL,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "hostal_foto_pkey" PRIMARY KEY ("id_foto","id_hostal")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id_servicio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "icono" TEXT,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "hostal_servicio" (
    "id_hostal" INTEGER NOT NULL,
    "id_servicio" INTEGER NOT NULL,
    "costo_adicional" DECIMAL(10,2),

    CONSTRAINT "hostal_servicio_pkey" PRIMARY KEY ("id_hostal","id_servicio")
);

-- CreateTable
CREATE TABLE "posts" (
    "id_post" SERIAL NOT NULL,
    "id_ciudad" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promedio_rating" DOUBLE PRECISION DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "nombre_lugar" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id_post")
);

-- CreateTable
CREATE TABLE "rating_post" (
    "id_post" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_valoracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puntuacion" INTEGER NOT NULL,

    CONSTRAINT "rating_post_pkey" PRIMARY KEY ("id_post","id_usuario")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id_comentario" SERIAL NOT NULL,
    "id_post" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_comentario" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "chats" (
    "id_chat" SERIAL NOT NULL,
    "id_hostal" INTEGER,
    "id_ciudad" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_chat" TEXT NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id_chat")
);

-- CreateTable
CREATE TABLE "mensajes" (
    "id_mensaje" SERIAL NOT NULL,
    "id_chat" INTEGER NOT NULL,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contenido" TEXT NOT NULL,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id_mensaje")
);

-- CreateTable
CREATE TABLE "usuario_chat" (
    "id_usuario" INTEGER NOT NULL,
    "id_chat" INTEGER NOT NULL,
    "fecha_union" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recibir_notificacion" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuario_chat_pkey" PRIMARY KEY ("id_usuario","id_chat")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuario_idioma" ADD CONSTRAINT "usuario_idioma_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_idioma" ADD CONSTRAINT "usuario_idioma_codigo_iso_fkey" FOREIGN KEY ("codigo_iso") REFERENCES "idiomas"("codigo_iso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ciudades" ADD CONSTRAINT "ciudades_codigo_pais_fkey" FOREIGN KEY ("codigo_pais") REFERENCES "paises"("codigo_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_paises" ADD CONSTRAINT "usuario_paises_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_paises" ADD CONSTRAINT "usuario_paises_codigo_pais_fkey" FOREIGN KEY ("codigo_pais") REFERENCES "paises"("codigo_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reservas"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_factura_fkey" FOREIGN KEY ("id_factura") REFERENCES "facturas"("id_factura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostales" ADD CONSTRAINT "hostales_id_direccion_fkey" FOREIGN KEY ("id_direccion") REFERENCES "direcciones"("id_direccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostales" ADD CONSTRAINT "hostales_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudades"("id_ciudad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitaciones" ADD CONSTRAINT "habitaciones_id_hostal_fkey" FOREIGN KEY ("id_hostal") REFERENCES "hostales"("id_hostal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_habitacion" ADD CONSTRAINT "reserva_habitacion_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reservas"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_habitacion" ADD CONSTRAINT "reserva_habitacion_id_habitacion_fkey" FOREIGN KEY ("id_habitacion") REFERENCES "habitaciones"("id_habitacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostal_foto" ADD CONSTRAINT "hostal_foto_id_foto_fkey" FOREIGN KEY ("id_foto") REFERENCES "fotos"("id_foto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostal_foto" ADD CONSTRAINT "hostal_foto_id_hostal_fkey" FOREIGN KEY ("id_hostal") REFERENCES "hostales"("id_hostal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostal_servicio" ADD CONSTRAINT "hostal_servicio_id_hostal_fkey" FOREIGN KEY ("id_hostal") REFERENCES "hostales"("id_hostal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostal_servicio" ADD CONSTRAINT "hostal_servicio_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudades"("id_ciudad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_post" ADD CONSTRAINT "rating_post_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id_post") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_post" ADD CONSTRAINT "rating_post_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id_post") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_id_hostal_fkey" FOREIGN KEY ("id_hostal") REFERENCES "hostales"("id_hostal") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudades"("id_ciudad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_id_chat_fkey" FOREIGN KEY ("id_chat") REFERENCES "chats"("id_chat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_chat" ADD CONSTRAINT "usuario_chat_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_chat" ADD CONSTRAINT "usuario_chat_id_chat_fkey" FOREIGN KEY ("id_chat") REFERENCES "chats"("id_chat") ON DELETE RESTRICT ON UPDATE CASCADE;
