import { AbilityCoefficient } from "./Creature";
import { WeightedActionKey } from "../actions/ActionList";
import { ItemType, Rarity } from "../items/items";

interface creatureData {
  typeName: string;
  abilityCoeff: AbilityCoefficient;
  actions: WeightedActionKey[];
  dropItems: {key: ItemType, weight: number}[];
  description: string;
}

export const creatureConfigs: Record<string, creatureData> = {
  "player": {
    typeName: "人类",
    description: "你",
    abilityCoeff: {
      str: { base: 10, growth: 1 },
      int: { base: 10, growth: 1 },
      con: { base: 10, growth: 1 },
      siz: { base: 10, growth: 0 },
      app: { base: 10, growth: 0 },
      dex: { base: 10, growth: 1 },
      armor: { base: 0, growth: 0 },
    },
    actions: [
      { actionKey: "powerfulDigAttackAction", weight: 0.1 },
      { actionKey: "attackAction", weight: 1 },
    ],
    dropItems: [],
  },

  "slime": {
    typeName: "史莱姆",
    description: "一种行动缓慢的软体生物，武器打上去没有什么手感",
    abilityCoeff: {
      str: { base: 10, growth: 1 },
      int: { base: 1, growth: 0 },
      con: { base: 10, growth: 1 },
      siz: { base: 5, growth: 0 },
      app: { base: 1, growth: 0 },
      dex: { base: 1, growth: 1 },
      armor: { base: 50, growth: 1 },
    },
    actions: [
      { actionKey: "attackAction", weight: 1 },
      { actionKey: "dazedAction", weight: 2 },
    ],
    dropItems: [
      {key: {category: "consumable", rarity: Rarity.Common, key: "brokenChest"}, weight: 1},
      {key: {category: "consumable", rarity: Rarity.Rare, key: "silverChest"}, weight: 0.2},
    ],
  },

  "dragon": {
    typeName: "龙",
    description: "森林食物链的顶端",
    abilityCoeff: {
      str: { base: 100, growth: 10 },
      int: { base: 10, growth: 1 },
      con: { base: 100, growth: 10 },
      siz: { base: 100, growth: 10 },
      app: { base: 10, growth: 1 },
      dex: { base: 10, growth: 5 },
      armor: { base: 50, growth: 10 },
    },
    actions: [
      { actionKey: "attackAction", weight: 1 },
    ],
    dropItems: [
      {key: {category: "consumable", rarity: Rarity.Rare, key: "silverChest"}, weight: 1},
    ],
  },

  "wolf": {
    typeName: "孤狼",
    description: "一匹行动敏捷的孤狼，对于普通人来说，它是一种危险的生物",
    abilityCoeff: {
      str: { base: 15, growth: 2 },
      int: { base: 3, growth: 1 },
      con: { base: 10, growth: 1 },
      siz: { base: 10, growth: 1 },
      app: { base: 5, growth: 0 },
      dex: { base: 20, growth: 3 },
      armor: { base: 0, growth: 1 },
    },
    actions: [
      { actionKey: "biteAction", weight: 1 },
      { actionKey: "dazedAction", weight: 0.5 },
    ],
    dropItems: [
      {key: {category: "consumable", rarity: Rarity.Common, key: "brokenChest"}, weight: 0.5},
      {key: {category: "consumable", rarity: Rarity.Rare, key: "silverChest"}, weight: 0.5},
    ],
  }
};

export type CreatureType = keyof typeof creatureConfigs;
