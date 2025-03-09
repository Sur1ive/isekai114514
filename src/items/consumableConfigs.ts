import type { Creature } from "../creatures/Creature";
import { Rarity, ConsumableData } from "./types";
import { openChest } from "./consumableUtils";

export const commonConsumableConfigs: Record<string, ConsumableData> = {
	"brokenChest": {
		name: "破烂的宝箱",
    description: "一个破烂的宝箱，里面可能会有一些有用的东西",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Common));
    },
  },
}

export const rareConsumableConfigs: Record<string, ConsumableData> = {
	"silverChest": {
		name: "银宝箱",
    description: "一个银宝箱，里面可能会有一些有用的东西",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Rare));
    },
  },
}
