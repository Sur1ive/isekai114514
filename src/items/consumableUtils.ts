import { Rarity } from "../types";
import { generateRandomEquipment } from "./equipmentUtils";

export function openChest(_chestLevel: number, rarity: Rarity) {
  if (Math.random() < 0.1) {
		rarity -= 1;
	} else if (Math.random() < 0.05) {
		rarity += 1;
	}
	rarity = rarity < Rarity.Common ? Rarity.Common : rarity;
	rarity = rarity > Rarity.Unique ? Rarity.Unique : rarity;
	return generateRandomEquipment(rarity);
}
