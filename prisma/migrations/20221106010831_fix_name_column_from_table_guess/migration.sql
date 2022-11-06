/*
  Warnings:

  - You are about to drop the column `secound_team_points` on the `Guess` table. All the data in the column will be lost.
  - Added the required column `second_team_points` to the `Guess` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_team_points" INTEGER NOT NULL,
    "second_team_points" INTEGER NOT NULL,
    "game_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    CONSTRAINT "Guess_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Guess_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guess" ("first_team_points", "game_id", "id", "participant_id") SELECT "first_team_points", "game_id", "id", "participant_id" FROM "Guess";
DROP TABLE "Guess";
ALTER TABLE "new_Guess" RENAME TO "Guess";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
