import { Creature } from "../creatures/Creature";
import { Item, ItemIdentifier, ItemType, Rarity } from "./items";
import { generateRandomEquipment } from "./equipments";

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
  }
}

export interface ConsumableData {
  name: string;
  description: string;
  effect: (target: Creature) => void;
}

export type ConsumableKey = keyof typeof commonConsumableConfigs | keyof typeof rareConsumableConfigs;

export const commonConsumableConfigs: Record<string, ConsumableData> = {
	"brokenChest": {
		name: "破烂的宝箱",
    description: "一个破烂的宝箱，里面可能会有一些有用的东西",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Common));
    },
  },
}

export const rareConsumableConfigs: Record<string, ConsumableData> = {
	"silverChest": {
		name: "银宝箱",
    description: "一个银宝箱，里面可能会有一些有用的东西",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Rare));
    },
  },
}

export function openChest(chestLevel: number, rarity: Rarity) {
	return generateRandomEquipment(rarity);
}
