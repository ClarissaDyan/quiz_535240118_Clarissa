/*
  Warnings:

  - You are about to drop the column `content` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Habit` table. All the data in the column will be lost.
  - Added the required column `description` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Habit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completedDays" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Habit" ("createdAt", "id") SELECT "createdAt", "id" FROM "Habit";
DROP TABLE "Habit";
ALTER TABLE "new_Habit" RENAME TO "Habit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
