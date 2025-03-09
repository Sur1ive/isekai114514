import { Creature } from "./Creature";
import type { ItemType } from "../items/types";
import { creatureConfigs, CreatureType } from "./creatureConfigs";
import { generateItem } from "../items/itemUtils";

export class Monster extends Creature {
	description: string;
  dropItems: {key: ItemType, weight: number}[];

  constructor(name: string, type: CreatureType, level: number, individualStrength: number) {
    // 为了使用class-transforme保存，设定默认值，默认值并没有意义
    name = name || "怪物";
    type = type || CreatureType.Slime;
    level = level || 1;
    individualStrength = individualStrength || 1;

    super(name, type, level, individualStrength);
    this.dropItems = creatureConfigs[type].dropItems;
		this.description = creatureConfigs[type].description;
  }

  randomDropItem() {
    const itemType = this.dropItems[Math.floor(Math.random() * this.dropItems.length)].key;
		return generateItem(itemType);
  }
}
