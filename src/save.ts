import { Player } from "./creatures/Player";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { Equipment } from "./items/Equipment";
import { Consumable } from "./items/Consumable";
import { ItemCategory } from "./items/types";
import { EquipmentBar } from "./creatures/types";
import { CreatureType } from "./creatures/creatureConfigs";
import { Monster } from "./creatures/Monster";

function encodeSave(jsonStr: string): string {
  return "ISK1:" + btoa(unescape(encodeURIComponent(jsonStr)));
}

function decodeSave(code: string): string {
  const payload = code.startsWith("ISK1:") ? code.slice(5) : code;
  return decodeURIComponent(escape(atob(payload)));
}

function showEmergencyBackup(context: string) {
  const raw = localStorage.getItem("playerData");
  if (!raw) return;
  const code = encodeSave(raw);
  console.error(`[${context}] 存档应急备份码已生成，请复制保存：`);
  console.error(code);
  try {
    navigator.clipboard.writeText(code);
    alert(`${context}出错！存档备份码已复制到剪贴板，请粘贴保存以备恢复。\n\n也可在控制台(F12)中查看。`);
  } catch {
    alert(`${context}出错！请打开控制台(F12)复制存档备份码以备恢复。`);
  }
}

export function saveGame(player: Player) {
  // 不保存仅在开始流程中存在的满状态野兽仙贝
  if (player.type === CreatureType.FullPowerPlayer114514) {
    return;
  }
  try {
    const plainPlayer = instanceToPlain(player);
    const json = JSON.stringify(plainPlayer);
    localStorage.setItem("playerData", json);
    localStorage.setItem("saveTime", JSON.stringify(Date.now()));
  } catch (e) {
    console.error("saveGame failed", e);
    showEmergencyBackup("保存");
  }
}

export function exportSave(): string | null {
  const raw = localStorage.getItem("playerData");
  if (!raw) return null;
  return encodeSave(raw);
}

export function importSave(code: string): boolean {
  try {
    const json = decodeSave(code);
    JSON.parse(json);
    localStorage.setItem("playerData", json);
    localStorage.setItem("saveTime", JSON.stringify(Date.now()));
    return true;
  } catch (e) {
    console.error("importSave failed", e);
    return false;
  }
}

export function loadPlayer(): Player | null {
  const data = localStorage.getItem("playerData");
  if (!data) {
    console.log("No player data found");
    return null;
  }

  let plainPlayer: Record<string, any>;
  try {
    plainPlayer = JSON.parse(data);
  } catch (e) {
    console.error("loadPlayer JSON parse failed", e);
    showEmergencyBackup("读档");
    return null;
  }

  try {
    return reconstructPlayer(plainPlayer);
  } catch (e) {
    console.error("loadPlayer reconstruct failed", e);
    showEmergencyBackup("读档");
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reconstructPlayer(plainPlayer: Record<string, any>): Player {
  // 不使用player = plainToInstance(Player, plainPlayer);，而是new一个Player，然后手动复原必要的属性，以应对版本更新
  // 即便某个属性读取失败，也不会影响其他属性
  const player = new Player(plainPlayer.name, plainPlayer.type);

  // 从Creature类复原基础属性
  const creatureProps = [
    "level", "health", "statuses", "plusAbilityPoint", "plusAbility"
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

  player.calculateAbility();
  player.calculateMaxHealth();

  // 从Player类复原特有属性
  const playerProps = [
    "log", "capturedMonster", "activePetIndex", "exp",
    "currentMapData", "unlockedRegionIdList", "unlockedNodeIdList",
    "resourceNodeLastCollectedTime", "persistedBoss", "lifeSpring"
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

  // 恢复 persistedBoss 和 capturedMonster 的 Monster 实例
  try {
    if (player.persistedBoss) {
      for (const nodeId of Object.keys(player.persistedBoss)) {
        player.persistedBoss[nodeId] = player.persistedBoss[nodeId].map((boss: Monster) => {
          return plainToInstance(Monster, boss);
        });
      }
    } else {
      player.persistedBoss = {};
    }
  } catch (e) {
    player.persistedBoss = {};
    console.error("load player persistedBoss error", e);
  }
  try {
    player.capturedMonster = player.capturedMonster.map((monster: Monster) => {
      return plainToInstance(Monster, monster);
    });
  } catch (e) {
    console.error("load player capturedMonster error", e);
  }

  // 恢复装备栏
  try {
    const {body, hand, foot, accessory} = plainPlayer.equipments as EquipmentBar;
    player.equipments = {
      body: body ? plainToInstance(Equipment, body) : null,
      hand: hand ? plainToInstance(Equipment, hand) : null,
      foot: foot ? plainToInstance(Equipment, foot) : null,
      accessory: accessory ? plainToInstance(Equipment, accessory) : null,
    };
  } catch (e) {
    console.error("load player equipments error", e);
  }

  // 清除状态。不保存的时候清除是为了保留secondStatus
  player.clearStatus();

  // 离线期间：泉水增长 + 宠物回血
  const saveTime = localStorage.getItem("saveTime");
  if (saveTime) {
    const timeDiff = (Date.now() - JSON.parse(saveTime)) / 1000;
    player.growLifeSpring(timeDiff);
    for (const pet of player.capturedMonster) {
      const petRecover = pet.getMaxHealth() * 0.01 * (timeDiff / 600);
      pet.recoverHp(petRecover);
      if (pet.isFainted && pet.health >= pet.getMaxHealth() * 0.3) {
        pet.isFainted = false;
      }
    }
  }

  return player;
}
