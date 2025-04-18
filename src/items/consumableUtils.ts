import { Rarity } from "../types";
import { generateRandomEquipment } from "./equipmentUtils";

export function openSpecialChest(chestLevel: number, rarity: Rarity) {
  for (let i = 0; i < 2; i++) {
    if (Math.random() < 0.1) {
      rarity -= 1;
    } else if (Math.random() < 0.05) {
      rarity += 1;
    }
  }
  rarity = rarity < Rarity.Common ? Rarity.Common : rarity;
  rarity = rarity > Rarity.Unique ? Rarity.Unique : rarity;
  let euipmentLevel = Math.floor(chestLevel + 10 * (Math.random() - 0.5));
  if (euipmentLevel < 0) {
    euipmentLevel = 0;
  }
  return generateRandomEquipment(rarity, euipmentLevel);
}

export function openChest(chestLevel: number, rarity: Rarity) {
  if (Math.random() < 0.1) {
    rarity -= 1;
  } else if (Math.random() < 0.05) {
    rarity += 1;
  }
  rarity = rarity < Rarity.Common ? Rarity.Common : rarity;
  rarity = rarity > Rarity.Mythical ? Rarity.Mythical : rarity;
  let euipmentLevel = Math.floor(chestLevel + 10 * (Math.random() - 0.5));
  if (euipmentLevel < 0) {
    euipmentLevel = 0;
    }
  const equipment = generateRandomEquipment(rarity, euipmentLevel);
  equipment.showItemToast();
  return equipment;
}
