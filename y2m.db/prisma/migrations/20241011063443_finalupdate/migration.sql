/*
  Warnings:

  - A unique constraint covering the columns `[organizationname]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Organization_organizationname_key" ON "Organization"("organizationname");
