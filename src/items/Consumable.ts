import type { Creature } from "../creatures/Creature";
import { Item } from "./Item";
import { ItemCategory } from "./types";
import { ConsumableType, consumableConfigs } from "./consumableConfigs";
import { v4 as uuidv4 } from "uuid";

export class Consumable extends Item {
  canNotBeUsed = false;
  constructor(type: ConsumableType, level: number = 0) {
    type = type || ConsumableType.Unknown;
    const data = consumableConfigs[type];
    super(
      data.name,
      uuidv4(),
      ItemCategory.Consumable,
      type,
      data.rarity,
      level,
      data.description,
    );
    this.canNotBeUsed = data.canNotBeUsed || false;
  }

  useItem(target: Creature) {
    if (this.canNotBeUsed) {
      return;
    }
    consumableConfigs[this.type as ConsumableType].effect(target, this.level);
    target.pack = target.pack.filter((item) => item.uuid !== this.uuid);
  }
}
