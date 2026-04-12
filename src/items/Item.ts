import { ItemCategory, ItemType } from "./types";
import { Rarity } from "../types";
import { showToast } from "../utils/toast";

export abstract class Item {
  name: string;
  uuid: string;
  category: ItemCategory;
  type: ItemType;
  rarity: Rarity;
  level: number;
  description: string;
  constructor(
    name: string,
    uuid: string,
    category: ItemCategory,
    type: ItemType,
    rarity: Rarity,
    level: number,
    description: string,
  ) {
    this.name = name;
    this.uuid = uuid;
    this.category = category;
    this.type = type;
    this.rarity = rarity;
    this.level = level;
    this.description = description;
  }

  getName(): string {
    return this.name;
  }

  showItemToast() {
    const itemType = this.category === ItemCategory.Equipment ? "装备" : "道具";
    showToast(
      `获得${itemType}`,
      `获得了 ${this.getItemIcon()} <strong class="text-${Rarity[this.rarity]}">${this.getName()}</strong>！`,
    );
  }

  getItemIcon(): string {
    switch (this.category) {
      case ItemCategory.Equipment:
        return "🗡️";
      case ItemCategory.Consumable:
        return "🗝️";
      default:
        return "";
    }
  }
}
