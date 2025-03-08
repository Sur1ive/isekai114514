import { ConsumableKey, Consumable } from "./consumables";
import { EquipmentKey, Equipment, generateEquipment, EquipmentPrefix } from "./equipments";
import { v4 as uuidv4 } from 'uuid';

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

export function generateItem(type: ItemType) : ItemIdentifier {
  switch (type.category) {
    case "consumable":
      return {id: uuidv4(), type: type};
    case "equipment":
      return generateEquipment(type);
  }
}

export function getItemInstance(identifier: ItemIdentifier) {
	if (identifier.type.category === "consumable") {
		return new Consumable(identifier);
	} else if (identifier.type.category === "equipment") {
		return new Equipment(identifier);
	} else {
		throw new Error("Invalid item category");
	}
}

