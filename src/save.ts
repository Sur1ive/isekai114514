import { Player } from "./creatures/Player";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { setIntervals } from "./globalIntervals";
import { Equipment } from "./items/Equipment";
import { Consumable } from "./items/Consumable";
import { ItemCategory } from "./items/types";
import { CreatureType } from "./creatures/creatureConfigs";

export function saveGame(player: Player) {
  // 不保存仅在开始流程中存在的满状态野兽仙贝
  if (player.type === CreatureType.FullPowerPlayer114514) {
    return;
  }
  const plainPlayer = instanceToPlain(player);
  localStorage.setItem("playerData", JSON.stringify(plainPlayer));
  localStorage.setItem("saveTime", JSON.stringify(Date.now()));
}

export function loadPlayer(): Player | null {
  const data = localStorage.getItem("playerData");
  if (!data) {
    console.log("No player data found");
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plainPlayer: Record<string, any> = JSON.parse(data);
  let player: Player;

  // 尝试把plainPlayer转换为Player，如果失败则尝试通过逐个复原属性以复原存档(这样的话只会丢失报错的属性)
  try {
    player = plainToInstance(Player, plainPlayer);
  } catch (error) {
    console.error("loadPlayer error", error);
    alert("存档损坏，尝试自动修复");
    player = new Player(plainPlayer.name, plainPlayer.type);

    // 从Creature类复原基础属性
    const creatureProps = [
      "level", "maxHealth", "health", "ability",
      "statuses", "pack", "equipments"
    ];

    creatureProps.forEach(prop => {
      if (plainPlayer[prop] !== undefined) {
        try {
          // @ts-expect-error 动态复制属性，类型无法静态检查
          player[prop] = plainPlayer[prop];
        } catch (e) {
          console.error(`无法复原属性 ${prop}`, e);
        }
      }
    });

    // 从Player类复原特有属性
    const playerProps = [
      "log", "capturedMonster", "exp",
      "currentMapData", "unlockedRegionIdList", "unlockedNodeIdList"
    ];

    playerProps.forEach(prop => {
      if (plainPlayer[prop] !== undefined) {
        try {
          // @ts-expect-error 动态复制属性，类型无法静态检查
          player[prop] = plainPlayer[prop];
        } catch (e) {
          console.error(`无法复原属性 ${prop}`, e);
        }
      }
    });
  }

  setIntervals(player);

  // 由于背包是Item[]，所以需要把背包中装备转换回Equipment，消耗品转换回Consumable
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    player.pack = plainPlayer.pack.map((item: any) => {
      if (item.category === ItemCategory.Equipment) {
        return plainToInstance(Equipment, item);
    } else if (item.category === ItemCategory.Consumable) {
      return plainToInstance(Consumable, item);
    }
      return item;
    });
  } catch (e) {
    player.pack = [];
    console.error("load player pack error", e);
  }

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
