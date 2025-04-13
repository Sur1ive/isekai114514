import { Creature } from "./Creature";
import type { ItemType } from "../items/types";
import { creatureConfigs, CreatureType } from "./creatureConfigs";
import { generateItem } from "../items/itemUtils";

export class Monster extends Creature {
  description: string;
  dropItems: { type: ItemType | null; weight: number }[];
  giveExp: number = 0;

  constructor(
    type: CreatureType,
    level: number,
    individualStrength: number,
    name?: string,
  ) {
    // 为了使用class-transformer保存，设定默认值，默认值并没有意义
    type = type || CreatureType.Slime;
    name = name || creatureConfigs[type].typeName;
    level = level || 1;
    individualStrength = individualStrength || 1;

    super(name, type, level, individualStrength);
    this.dropItems = creatureConfigs[type].dropItems;
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
