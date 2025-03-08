import { ConsumableKey } from "./consumables";
import { EquipmentKey, EquipmentPrefix } from "./equipments";

export type ItemCategory = "consumable" | "equipment";

export enum Rarity {
	Common = 0,
  Rare = 1,
  Epic = 2,
  Legendary = 3,
}

export interface ItemType {
	category: ItemCategory;
	rarity: Rarity;
	key: EquipmentKey | ConsumableKey;
}

export interface ItemIdentifier {
	id: string;
	type: ItemType;
	prefix?: EquipmentPrefix;
}

export class Item {
	name: string;
	description: string;
	identifier: ItemIdentifier;
	constructor(identifier: ItemIdentifier) {
		this.identifier = identifier;
		this.name = "";
		this.description = "";
	}
}


