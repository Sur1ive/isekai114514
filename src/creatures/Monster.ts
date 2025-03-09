import { Creature } from "./Creature";
import type { ItemType } from "../items/types";
import { creatureConfigs, CreatureType } from "./creatureConfigs";
import { generateItem } from "../items/itemUtils";

export class Monster extends Creature {
	description: string;
  dropItems: {key: ItemType, weight: number}[];

  constructor(name: string, type: CreatureType, level: number, individualStrength: number) {
    super(name, type, level, individualStrength);
    this.dropItems = creatureConfigs[type].dropItems;
		this.description = creatureConfigs[type].description;
  }

  randomDropItem() {
    const itemType = this.dropItems[Math.floor(Math.random() * this.dropItems.length)].key;
		return generateItem(itemType);
  }
}
