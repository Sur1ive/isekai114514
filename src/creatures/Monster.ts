import { Creature } from "./Creature";
import type { ItemType } from "../items/types";
import { creatureConfigs, CreatureType } from "./creatureConfigs";
import { generateItem } from "../items/itemUtils";

export type MonsterVariant = "normal" | "veteran" | "mutant";

export class Monster extends Creature {
  description: string;
  dropItems: { type: ItemType | null; weight: number }[];
  giveExp: number = 0;
  variant: MonsterVariant = "normal";
  isFainted: boolean = false;
  exp: number = 0;

  constructor(
    type: CreatureType,
    level: number,
    individualStrength: number,
    name?: string,
  ) {
    type = type || CreatureType.Slime;
    name = name || creatureConfigs[type].typeName;
    level = level || 1;
    individualStrength = individualStrength || 1;

    super(name, type, level, individualStrength);
    this.dropItems = creatureConfigs[type].dropItems.map(d => ({ ...d }));
    this.description = creatureConfigs[type].description;
    if (creatureConfigs[type].image) {
      this.image = creatureConfigs[type].image;
    }
    const initStatus = creatureConfigs[type].initStatus;
    if (initStatus) {
      for (const status of initStatus) {
        this.addStatus(status.type, status.duration);
      }
    }
    this.giveExp = Math.floor(this.getMaxHealth()) * (1 + this.level / 10);
  }

  getPetDamageMultiplier(): number {
    switch (this.variant) {
      case "veteran": return 0.25;
      case "mutant": return 0.3;
      default: return 0.2;
    }
  }

  getNextLevelExp(): number {
    return 800 + this.level * 200;
  }

  addExp(amount: number): boolean {
    this.exp += amount;
    let leveled = false;
    let req = this.getNextLevelExp();
    while (this.exp >= req) {
      this.exp -= req;
      this.levelup();
      leveled = true;
      req = this.getNextLevelExp();
    }
    return leveled;
  }

  randomDropItem() {
    // 按照权重随机返回一个物品
    const totalWeight = this.dropItems.reduce(
      (sum, item) => sum + item.weight,
      0,
    );
    let random = Math.random() * totalWeight;
    for (const item of this.dropItems) {
      if (random < item.weight && item.type) {
        return generateItem(item.type, this.level);
      }
      random -= item.weight;
    }
    return null;
  }
}

export function applyVariant(monster: Monster): void {
  const roll = Math.random();
  if (roll < 0.005) {
    monster.variant = "mutant";
    monster.individualStrength *= 1.3;
    monster.name = "变异" + monster.name;
  } else if (roll < 0.025) {
    monster.variant = "veteran";
    monster.individualStrength *= 1.1;
    monster.name = "历战" + monster.name;
  } else {
    return;
  }
  monster.calculateAbility();
  monster.calculateMaxHealth();
  monster.health = monster.getMaxHealth();
  monster.giveExp = Math.floor(monster.getMaxHealth()) * (1 + monster.level / 10);
}
