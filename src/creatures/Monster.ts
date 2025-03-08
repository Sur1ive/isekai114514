import { Creature } from "./Creature";
import { ItemType } from "../items/items";
import { CreatureType, creatureConfigs } from "./CreatureType";
import { generateItem } from "../items/items";

export class Monster extends Creature {
  dropItems: {key: ItemType, weight: number}[];
  constructor(name: string, type: CreatureType, level: number, individualStrength: number) {
    super(name, type, level, individualStrength);
    this.dropItems = creatureConfigs[type].dropItems;
  }

  randomDropItem() {
    const itemType = this.dropItems[Math.floor(Math.random() * this.dropItems.length)].key;
		return generateItem(itemType);
  }
}
