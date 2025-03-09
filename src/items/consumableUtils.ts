import { Rarity } from "./types";
import { generateRandomEquipment } from "./equipmentUtils";

export function openChest(_chestLevel: number, rarity: Rarity) {
	return generateRandomEquipment(rarity);
}
