import { Creature } from "./Creature";
import type { ItemType } from "../items/types";
import { creatureConfigs, CreatureType } from "./creatureConfigs";
import { generateItem } from "../items/itemUtils";

export class Monster extends Creature {
  description: string;
  dropItems: { type: ItemType | null; weight: number }[];
  giveExp: number = 0;

  constructor(
    name: string,
    type: CreatureType,
    level: number,
    individualStrength: number,
  ) {
    // 为了使用class-transformer保存，设定默认值，默认值并没有意义
    name = name || "怪物";
    type = type || CreatureType.Slime;
    level = level || 1;
    individualStrength = individualStrength || 1;

    super(name, type, level, individualStrength);
    this.dropItems = creatureConfigs[type].dropItems;
    this.description = creatureConfigs[type].description;
    this.giveExp = Math.floor(this.maxHealth) * (1 + this.level / 10);
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
