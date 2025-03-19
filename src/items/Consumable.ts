import type { Creature } from "../creatures/Creature";
import { Item } from "./Item";
import { ItemCategory } from "./types";
import { ConsumableType, consumableConfigs } from "./consumableConfigs";
import { v4 as uuidv4 } from "uuid";

export class Consumable extends Item {
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
  }

  useItem(target: Creature) {
    consumableConfigs[this.type as ConsumableType].effect(target);
    target.pack = target.pack.filter((item) => item.uuid !== this.uuid);
  }
}
