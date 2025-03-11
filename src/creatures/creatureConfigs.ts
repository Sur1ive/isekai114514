import { ConsumableType } from "../items/consumableConfigs";
import type { CreatureData } from "./types";
import { ActionType } from "../actions/actionConfigs";

export enum CreatureType {
  Player = "Player",
  Player114514 = "Player114514",
  Slime = "Slime",
  Dragon = "Dragon",
  AngryDragon = "AngryDragon",
  WeakDragon = "WeakDragon",
  Wolf = "Wolf",
}

export const creatureConfigs: Record<CreatureType, CreatureData> = {
  [CreatureType.Player]: {
    typeName: "人类",
    description: "你",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 5, growth: 0.1 },
      con: { base: 5, growth: 0.1 },
      siz: { base: 5, growth: 0 },
      app: { base: 5, growth: 0 },
      dex: { base: 5, growth: 0.1 },
      armor: { base: 0, growth: 0 },
    },
    actions: [
      { actionType: ActionType.Attack, weight: 0.5 },
      { actionType: ActionType.PowerAttack, weight: 0.2 },
      { actionType: ActionType.Capture, weight: 0.1 },
      { actionType: ActionType.Defend, weight: 0.2 },
    ],
    dropItems: [],
  },
  [CreatureType.Player114514]: {
    typeName: "野兽仙贝",
    description: "114514",
    abilityCoeff: {
      str: { base: 5, growth: 0.2 },
      int: { base: 5, growth: 0 },
      con: { base: 7, growth: 0.1 }, // 小麦色的健康肤色
      siz: { base: 5, growth: 0.1 }, // 24岁是学生，还在长身体很合理吧
      app: { base: 7, growth: 0 }, // 没有魅力怎么能吸引后辈
      dex: { base: 5, growth: 0 },
      armor: { base: 0, growth: 0 },
    },
    actions: [
      { actionType: ActionType.PowerfulDigAttack, weight: 0.2 },
      { actionType: ActionType.Attack, weight: 0.7 },
      { actionType: ActionType.PowerAttack, weight: 0.2 },
      { actionType: ActionType.Capture, weight: 0.1 },
      { actionType: ActionType.Defend, weight: 0.2 },
    ],
    dropItems: [],
  },

  [CreatureType.Slime]: {
    typeName: "史莱姆",
    description: "一种行动缓慢的软体生物，武器打上去没有什么手感",
    abilityCoeff: {
      str: { base: 3, growth: 0.05 },
      int: { base: 0, growth: 0 },
      con: { base: 3, growth: 0.05 },
      siz: { base: 2, growth: 0 },
      app: { base: 0, growth: 0 },
      dex: { base: 1, growth: 0.05 },
      armor: { base: 50, growth: 1 },
    },
    actions: [
      { actionType: ActionType.Attack, weight: 1 },
      { actionType: ActionType.Defend, weight: 1 },
      { actionType: ActionType.Dazed, weight: 2 },
    ],
    dropItems: [
      {type: ConsumableType.BrokenChest, weight: 1},
      {type: ConsumableType.SilverChest, weight: 0.1},
    ],
  },

  [CreatureType.Dragon]: {
    typeName: "龙",
    description: "生态位的顶端，人类在它面前就像一只蝼蚁",
    abilityCoeff: {
      str: { base: 10, growth: 0.2 },
      int: { base: 4, growth: 0.1 },
      con: { base: 20, growth: 0.2 },
      siz: { base: 20, growth: 0.2 },
      app: { base: 4, growth: 0.1 },
      dex: { base: 4, growth: 0.1 },
      armor: { base: 50, growth: 10 },
    },
    actions: [
      { actionType: ActionType.Bite, weight: 0.1 },
      { actionType: ActionType.PowerAttack, weight: 0.2 },
      { actionType: ActionType.Counter, weight: 0.2 },
      { actionType: ActionType.DragonBreath, weight: 0.2 },
      { actionType: ActionType.QuickAttack, weight: 0.2 },
      { actionType: ActionType.Defend, weight: 0.1 },
    ],
    dropItems: [],
  },

  [CreatureType.AngryDragon]: {
    typeName: "愤怒的龙",
    description: "龙彻底被激怒了，一只蝼蚁居然让它受了伤。它有些虚弱，但是攻击更加狂暴了",
    abilityCoeff: {
      str: { base: 15, growth: 0.3 },
      int: { base: 3, growth: 0.05 },
      con: { base: 10, growth: 0.1 },
      siz: { base: 20, growth: 0.2 },
      app: { base: 2, growth: 0.05 },
      dex: { base: 6, growth: 0.15 },
      armor: { base: 25, growth: 5 },
    },
    actions: [
      { actionType: ActionType.Bite, weight: 0.1 },
      { actionType: ActionType.PowerAttack, weight: 0.2 },
      { actionType: ActionType.DragonBreath, weight: 0.2 },
      { actionType: ActionType.QuickAttack, weight: 0.2 },
    ],
    dropItems: [],
  },

  [CreatureType.WeakDragon]: {
    typeName: "虚弱的龙",
    description: "它抛弃了自己作为龙的尊严，现在一心只想活下去",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 6, growth: 0.15 },
      con: { base: 5, growth: 0.05 },
      siz: { base: 20, growth: 0.2 },
      app: { base: 2, growth: 0.05 },
      dex: { base: 4, growth: 0.1 },
      armor: { base: 20, growth: 3 },
    },
    actions: [
      { actionType: ActionType.Bite, weight: 0.2 },
      { actionType: ActionType.Counter, weight: 0.3 },
      { actionType: ActionType.DragonBreath, weight: 0.2 },
      { actionType: ActionType.Defend, weight: 0.3 },
    ],
    dropItems: [],
  },

  [CreatureType.Wolf]: {
    typeName: "孤狼",
    description: "一匹行动敏捷的孤狼，对于普通人来说，它是一种危险的生物",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 2, growth: 0.05 },
      con: { base: 5, growth: 0.1 },
      siz: { base: 4, growth: 0.05 },
      app: { base: 2, growth: 0 },
      dex: { base: 6, growth: 0.15 },
      armor: { base: 0, growth: 1 },
    },
    actions: [
      { actionType: ActionType.Bite, weight: 1 },
      { actionType: ActionType.Dazed, weight: 1 },
      { actionType: ActionType.QuickAttack, weight: 0.5 },
      { actionType: ActionType.SpinAttack, weight: 0.5 },
    ],
    dropItems: [
      {type: ConsumableType.BrokenChest, weight: 0.5},
      {type: ConsumableType.SilverChest, weight: 0.5},
    ],
  }
};

