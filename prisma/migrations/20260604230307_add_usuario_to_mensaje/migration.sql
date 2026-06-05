/*
  Warnings:

  - Added the required column `id_usuario` to the `mensajes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mensajes" ADD COLUMN     "id_usuario" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
