import { Player } from "./creatures/Player";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { setIntervals } from "./globalIntervals";
import { Equipment } from "./items/Equipment";
import { Consumable } from "./items/Consumable";
import { ItemCategory } from "./items/types";
import { EquipmentBar } from "./creatures/types";
import { CreatureType } from "./creatures/creatureConfigs";
import { Monster } from "./creatures/Monster";

export function saveGame(player: Player) {
  // 不保存仅在开始流程中存在的满状态野兽仙贝
  if (player.type === CreatureType.FullPowerPlayer114514) {
    return;
  }
  const plainPlayer = instanceToPlain(player);
  localStorage.setItem("playerData", JSON.stringify(plainPlayer));
  localStorage.setItem("saveTime", JSON.stringify(Date.now()));
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

  // 把boss转换回Monster
  player.currentMapData.boss = player.currentMapData.boss.map((boss) => {
    console.log(boss);
    return plainToInstance(Monster, boss);
  });

  // 清除状态。不保存的时候清除是为了保留secondStatus
  player.clearStatus();

  // 按照时间回血
  const saveTime = localStorage.getItem("saveTime");
  if (saveTime) {
    const timeDiff = (Date.now() - JSON.parse(saveTime)) / 1000;
    player.autoRecoverHpDot(timeDiff);
  }

  return player;
}
