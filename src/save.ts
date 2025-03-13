import { Player } from "./creatures/Player";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { setIntervals } from "./global";

export function saveGame(player: Player) {
  const plainPlayer = instanceToPlain(player);
  localStorage.setItem("playerData", JSON.stringify(plainPlayer));
}

export function loadPlayer(): Player {
  const data = localStorage.getItem("playerData");
  if (!data) {
    throw new Error("No player data found");
  }
  const plainPlayer: unknown = JSON.parse(data);
  const player = plainToInstance(Player, plainPlayer, {
    enableImplicitConversion: true,
  });
  setIntervals(player);
  return player;
}
