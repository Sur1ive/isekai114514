import type { Creature } from "../creatures/Creature";
import { Rarity } from "../types";
import { ConsumableData } from "./types";
import { openChest } from "./consumableUtils";

export enum ConsumableType {
  Unknown = "Unknown",
  BrokenChest = "BrokenChest",
  WoodenChest = "WoodenChest",
  SilverChest = "SilverChest",
  GoldChest = "GoldChest",
  DiamondChest = "DiamondChest",
}

export const consumableConfigs: Record<ConsumableType, ConsumableData> = {
	[ConsumableType.BrokenChest]: {
		name: "破烂的木宝箱",
    rarity: Rarity.Common,
    description: "一个破破烂烂的宝箱",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Common));
    },
  },
	[ConsumableType.WoodenChest]: {
		name: "木质的宝箱",
    rarity: Rarity.Rare,
    description: "一个有着漂亮的木质纹理的宝箱",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Rare));
    },
  },
	[ConsumableType.SilverChest]: {
		name: "银色装饰的宝箱",
    rarity: Rarity.Epic,
    description: "这个宝箱上有着精细的银制装饰，银锈并不能掩盖它的华丽",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Epic));
    },
  },
	[ConsumableType.GoldChest]: {
		name: "黄金镶边的宝箱",
    rarity: Rarity.Legendary,
    description: "金光闪闪，这才叫宝箱！光是看着就让人心潮澎湃",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Legendary));
    },
  },
  [ConsumableType.DiamondChest]: {
    name: "华丽的宝石宝箱",
    rarity: Rarity.Unique,
    description: "无法用辞藻形容的华丽，你甚至害怕打开它会划伤上面美丽的宝石",
    effect: (target: Creature) => {
			target.pack.push(openChest(1, Rarity.Unique));
    },
  },
  [ConsumableType.Unknown]: {
    name: "未知",
    rarity: Rarity.Common,
    description: "未知",
    effect: (_target: Creature) => {},
  },
}
