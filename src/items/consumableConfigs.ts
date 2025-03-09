import type { Creature } from "../creatures/Creature";
import { Rarity, ConsumableData } from "./types";
import { openChest } from "./consumableUtils";

export enum ConsumableType {
  Unknown = "Unknown",
  BrokenChest = "BrokenChest",
  SilverChest = "SilverChest",
}

export const consumableConfigs: Record<ConsumableType, ConsumableData> = {
	[ConsumableType.BrokenChest]: {
		name: "破烂的宝箱",
    rarity: Rarity.Common,
    description: "一个破烂的宝箱，里面可能会有一些有用的东西",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Common));
    },
  },
	[ConsumableType.SilverChest]: {
		name: "银宝箱",
    rarity: Rarity.Rare,
    description: "一个银宝箱，里面可能会有一些有用的东西",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Rare));
    },
  },
  [ConsumableType.Unknown]: {
    name: "未知",
    rarity: Rarity.Common,
    description: "未知",
    effect: (_target: Creature) => {},
  },
}
