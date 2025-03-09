import { Player } from "./creatures/Player";
import { instanceToPlain, plainToInstance } from "class-transformer";

export function saveGame(player: Player) {
  const plainPlayer = instanceToPlain(player);
  localStorage.setItem("playerData", JSON.stringify(plainPlayer));
}

export function loadPlayer(): Player {
  const data = localStorage.getItem("playerData");
  if (!data) {
    throw new Error("No player data found");
  }
  const plainPlayer = JSON.parse(data);
  console.log("Loaded player type:", plainPlayer.type);
  const result = plainToInstance(Player, plainPlayer);
  // 如果 result 是数组，则取第一个元素，否则直接返回
  return Array.isArray(result) ? result[0] : result;
}
