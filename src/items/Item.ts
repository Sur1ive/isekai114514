import { ItemCategory, ItemType } from "./types";
import type { Rarity } from "../types";

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
}
