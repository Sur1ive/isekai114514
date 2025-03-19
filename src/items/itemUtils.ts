import { Consumable } from "./Consumable";
import { Equipment } from "./Equipment";
import { ItemType } from "./types";
import { ConsumableType } from "./consumableConfigs";
import { EquipmentType } from "./equipmentConfigs";
import { Item } from "./Item";

export function generateItem(type: ItemType, level: number = 0): Item {
  if (type in ConsumableType) {
    return new Consumable(type as ConsumableType, level);
  } else if (type in EquipmentType) {
    return new Equipment(type as EquipmentType, level);
  } else {
    throw new Error("Invalid item type");
  }
}
