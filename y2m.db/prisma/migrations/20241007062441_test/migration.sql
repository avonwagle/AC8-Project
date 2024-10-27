/*
  Warnings:

  - You are about to drop the column `databaseUrl` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `databaseurl` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationname` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedat` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "databaseUrl",
DROP COLUMN "name",
ADD COLUMN     "contactemail" TEXT,
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "databasename" TEXT,
ADD COLUMN     "databaseurl" TEXT NOT NULL,
ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "isactive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "organizationname" TEXT NOT NULL,
ADD COLUMN     "subdomain" TEXT,
ADD COLUMN     "updatedat" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationLog" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "performedBy" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "OrganizationLog" ADD CONSTRAINT "OrganizationLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationLog" ADD CONSTRAINT "OrganizationLog_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
