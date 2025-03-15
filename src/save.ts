import { Player } from "./creatures/Player";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { setIntervals } from "./global";
import { Equipment } from "./items/Equipment";
import { Consumable } from "./items/Consumable";
import { ItemCategory } from "./items/types";
import { EquipmentBar } from "./creatures/types";

export function saveGame(player: Player) {
  const plainPlayer = instanceToPlain(player);
  localStorage.setItem("playerData", JSON.stringify(plainPlayer));
}

export function loadPlayer(): Player {
  const data = localStorage.getItem("playerData");
  if (!data) {
    throw new Error("No player data found");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plainPlayer: Record<string, any> = JSON.parse(data);
  const player = plainToInstance(Player, plainPlayer);
  setIntervals(player);

  // 把背包中装备转换回Equipment，消耗品转换回Consumable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player.pack = plainPlayer.pack.map((item: any) => {
    if (item.category === ItemCategory.Equipment) {
      return plainToInstance(Equipment, item);
    } else if (item.category === ItemCategory.Consumable) {
      return plainToInstance(Consumable, item);
    }
    return item;
  });
  // 把装备栏转换回Equipment
  const equipmentKeys = Object.keys(
    player.equipments,
  ) as (keyof EquipmentBar)[];
  equipmentKeys.forEach((key) => {
    if (player.equipments[key]) {
      player.equipments[key] = plainToInstance(
        Equipment,
        player.equipments[key],
      );
    }
  });
  return player;
}
