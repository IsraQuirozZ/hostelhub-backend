-- CreateTable
CREATE TABLE "rating_hostal" (
    "id_hostal" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "fecha_valoracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_hostal_pkey" PRIMARY KEY ("id_hostal","id_usuario")
);

-- AddForeignKey
ALTER TABLE "rating_hostal" ADD CONSTRAINT "rating_hostal_id_hostal_fkey" FOREIGN KEY ("id_hostal") REFERENCES "hostales"("id_hostal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_hostal" ADD CONSTRAINT "rating_hostal_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
