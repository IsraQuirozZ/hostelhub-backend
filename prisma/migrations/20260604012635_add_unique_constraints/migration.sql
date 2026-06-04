/*
  Warnings:

  - A unique constraint covering the columns `[codigo_pais,nombre]` on the table `ciudades` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `hostales` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `paises` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `servicios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ciudades_codigo_pais_nombre_key" ON "ciudades"("codigo_pais", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "hostales_email_key" ON "hostales"("email");

-- CreateIndex
CREATE UNIQUE INDEX "paises_nombre_key" ON "paises"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "servicios_nombre_key" ON "servicios"("nombre");
