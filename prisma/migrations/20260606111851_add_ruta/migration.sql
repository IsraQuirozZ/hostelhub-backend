-- CreateTable
CREATE TABLE "rutas" (
    "id_ruta" SERIAL NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "ciudad" TEXT NOT NULL,
    "paradas" JSONB NOT NULL,
    "generada_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rutas_pkey" PRIMARY KEY ("id_ruta")
);

-- CreateIndex
CREATE UNIQUE INDEX "rutas_id_reserva_key" ON "rutas"("id_reserva");

-- AddForeignKey
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reservas"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
