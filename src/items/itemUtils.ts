import { Consumable } from "./Consumable";
import { Equipment } from "./Equipment";
import { v4 as uuidv4 } from 'uuid';
import type { ItemType, ItemIdentifier } from "./types";
import { generateEquipment } from "./equipmentUtils";

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

export function getItemName(identifier: ItemIdentifier) {
  return identifier.prefix ? identifier.prefix + getItemInstance(identifier).name : getItemInstance(identifier).name;
}
