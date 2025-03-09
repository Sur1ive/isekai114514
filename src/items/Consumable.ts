import type { Creature } from "../creatures/Creature";
import { Item } from "./Item";
import { ItemIdentifier, Rarity, ConsumableData } from "./types";
import { commonConsumableConfigs, rareConsumableConfigs } from "./consumableConfigs";

export class Consumable extends Item {
  effect: (target: Creature) => void;
  constructor(identifier: ItemIdentifier) {
    super(identifier);
		let data: ConsumableData;
		switch (identifier.type.rarity) {
			case Rarity.Common:
				data = commonConsumableConfigs[identifier.type.key];
				break;
			case Rarity.Rare:
				data = rareConsumableConfigs[identifier.type.key];
				break;
			default:
				throw new Error("Invalid rarity");
		}
		this.effect = data.effect;
		this.name = data.name;
		this.description = data.description;
  }
  useItem(target: Creature) {
    this.effect(target);
    target.pack = target.pack.filter(item => item.id !== this.identifier.id);
  }
}




