/*
  Warnings:

  - You are about to drop the column `secound_team_country_code` on the `Game` table. All the data in the column will be lost.
  - Added the required column `second_team_country_code` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "first_team_country_code" TEXT NOT NULL,
    "second_team_country_code" TEXT NOT NULL
);
INSERT INTO "new_Game" ("date", "first_team_country_code", "id") SELECT "date", "first_team_country_code", "id" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
