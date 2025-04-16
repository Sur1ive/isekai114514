import { Player } from "./creatures/Player";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { setIntervals } from "./globalIntervals";
import { Equipment } from "./items/Equipment";
import { Consumable } from "./items/Consumable";
import { ItemCategory } from "./items/types";
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

export function loadPlayer(): Player | null {
  const data = localStorage.getItem("playerData");
  if (!data) {
    console.log("No player data found");
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plainPlayer: Record<string, any> = JSON.parse(data);

  // 不使用player = plainToInstance(Player, plainPlayer);，而是new一个Player，然后手动复原必要的属性，以应对版本更新
  // 即便某个属性读取失败，也不会影响其他属性
  const player = new Player(plainPlayer.name, plainPlayer.type);

  // 从Creature类复原基础属性
  const creatureProps = [
    "level", "health", "statuses", "equipments"
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

  player.ability = player.calculateAbility();
  player.maxHealth = player.calculateMaxHealth();

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

  // 恢复currentMapData.boss和capturedMonster的Monster实例
  try {
    player.currentMapData.boss = player.currentMapData.boss.map((boss: Monster) => {
      return plainToInstance(Monster, boss);
    });
  } catch (e) {
    console.error("load player currentMapData.boss error", e);
  }
  try {
    player.capturedMonster = player.capturedMonster.map((monster: Monster) => {
      return plainToInstance(Monster, monster);
    });
  } catch (e) {
    console.error("load player capturedMonster error", e);
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
