import { EquipmentPosition, EquipmentData } from "./types";
import { ActionCategory } from "../actions/types";
import { ActionType } from "../actions/actionConfigs";
import { Rarity } from "../types";

export enum EquipmentType {
  Sword = "Sword",
  Katana = "Katana",
  WindSpinSword = "WindSpinSword",
  AyulsaOfNoHonor = "AyulsaOfNoHonor",
  RockSword = "RockSword",
  Rope = "Rope",
  DragonSlayer = "DragonSlayer",
}

export const equipmentConfigs: Record<EquipmentType, EquipmentData> = {
  [EquipmentType.Sword]: {
    name: "剑",
    description: "一把剑,平平无奇的武器",
    rarity: Rarity.Common,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.Attack, weight: 0.3 },
      { actionType: ActionType.PowerAttack, weight: 0.2 },
    ],
    ability: {},
    actionCoeff: {
      [ActionCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [EquipmentType.Rope]: {
    name: "绳索",
    description: "绳索,看起来很适合用来捕捉",
    rarity: Rarity.Common,
    position: EquipmentPosition.Hand,
    extraActions: [{ actionType: ActionType.Capture, weight: 0.2 }],
    ability: {},
    actionCoeff: {
      [ActionCategory.Attack]: {
        plus: -1,
        multiply: 0.9,
      },
      [ActionCategory.Capture]: {
        plus: 2,
        multiply: 1,
      },
    },
  },
  [EquipmentType.Katana]: {
    name: "太刀",
    description: "太好了，有了这个，你就可以做虾头太刀侠了",
    rarity: Rarity.Rare,
    position: EquipmentPosition.Hand,
    extraActions: [{ actionType: ActionType.HorizontalSlash, weight: 1 }],
    ability: {
      str: 1,
      dex: -1,
    },
    actionCoeff: {
      [ActionCategory.Attack]: {
        plus: 2,
        multiply: 1,
      },
      [ActionCategory.Dodge]: {
        plus: -2,
        multiply: 1,
      },
      [ActionCategory.DexAction]: {
        plus: -2,
        multiply: 1,
      },
    },
  },
  [EquipmentType.WindSpinSword]: {
    name: "风旋刺剑",
    description: "靠近剑身能听到轻轻的风声",
    rarity: Rarity.Epic,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.QuickAttack, weight: 0.4 },
      { actionType: ActionType.Dodge, weight: 0.2 },
      { actionType: ActionType.SpinAttack, weight: 0.4 },
    ],
    ability: {
      dex: 2,
    },
    actionCoeff: {
      [ActionCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
      [ActionCategory.Dodge]: {
        plus: 2,
        multiply: 1,
      },
      [ActionCategory.DexAction]: {
        plus: 2,
        multiply: 1,
      },
    },
  },
  [EquipmentType.RockSword]: {
    name: "剑型大石头",
    description: "一把很宽的石头大剑，看起来就像块大石头",
    rarity: Rarity.Epic,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.DefenseSlash, weight: 0.4 },
      { actionType: ActionType.Defend, weight: 0.2 },
      { actionType: ActionType.Counter, weight: 0.4 },
      { actionType: ActionType.PowerAttack, weight: 0.2 },
    ],
    ability: {
      str: 1,
      con: 1,
    },
    actionCoeff: {
      [ActionCategory.Attack]: {
        plus: 2,
        multiply: 1,
      },
      [ActionCategory.Defend]: {
        plus: 3,
        multiply: 1,
      },
    },
  },
  [EquipmentType.DragonSlayer]: {
    name: "弑龙者",
    description: "传说这把剑上的龙之力来源于被它杀死的龙",
    rarity: Rarity.Legendary,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.HorizontalSlash, weight: 1 },
      { actionType: ActionType.DragonBreath, weight: 0.5 },
    ],
    ability: {
      str: 1,
      con: 2,
    },
    actionCoeff: {
      [ActionCategory.Attack]: {
        plus: 3,
        multiply: 1.1,
      },
    },
  },
  [EquipmentType.AyulsaOfNoHonor]: {
    name: "Ayulsa死于徒手",
    description: "Ayulsa手上没有武器",
    rarity: Rarity.Unique,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.PsyKick, weight: 0.2 },
      { actionType: ActionType.PsyExplosion, weight: 1 },
      { actionType: ActionType.PsyInvisibleSword, weight: 0.2 },
      { actionType: ActionType.PsyDodge, weight: 0.6 },
    ],
    ability: {
      int: 2,
      dex: 2,
    },
    actionCoeff: {},
  },
};
