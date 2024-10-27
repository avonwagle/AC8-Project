/*
  Warnings:

  - You are about to drop the `DevelopmentArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Education` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenteeInterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MentorArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DevelopmentArea" DROP CONSTRAINT "DevelopmentArea_userId_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_userId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_userId_fkey";

-- DropForeignKey
ALTER TABLE "MenteeInterest" DROP CONSTRAINT "MenteeInterest_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "MentorArea" DROP CONSTRAINT "MentorArea_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "developmentAreas" TEXT[],
ADD COLUMN     "education" TEXT[],
ADD COLUMN     "experience" TEXT[],
ADD COLUMN     "menteeInterests" TEXT[],
ADD COLUMN     "mentorAreas" TEXT[],
ADD COLUMN     "skills" TEXT[];

-- DropTable
DROP TABLE "DevelopmentArea";

-- DropTable
DROP TABLE "Education";

-- DropTable
DROP TABLE "Experience";

-- DropTable
DROP TABLE "MenteeInterest";

-- DropTable
DROP TABLE "MentorArea";

-- DropTable
DROP TABLE "Skill";
