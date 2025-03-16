import { EquipmentPosition, EquipmentData } from "./types";
import { HitCategory } from "../actions/types";
import { ActionType } from "../actions/actionConfigs";
import { Rarity } from "../types";

export enum EquipmentType {
  Sword = "Sword",
  ShabbyKatana = "ShabbyKatana",
  GreatKatana = "GreatKatana",
  Ningenmukotsu = "Ningenmukotsu",
  Mikadsukimunechika = "Mikadsukimunechika",
  MudKnife = "MudKnife",
  WindSpinSword = "WindSpinSword",
  AyulsaOfNoHonor = "AyulsaOfNoHonor",
  RockSword = "RockSword",
  Rope = "Rope",
  DragonSlayer = "DragonSlayer",
}

export const equipmentConfigs: Record<EquipmentType, EquipmentData> = {
  [EquipmentType.Sword]: {
    name: "铁剑",
    description: "一把平平无奇的剑",
    rarity: Rarity.Common,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.Slash, weight: 0.8 },
      { actionType: ActionType.HorizontalSlash, weight: 0.2 },
    ],
    ability: {},
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [EquipmentType.Rope]: {
    name: "绳索",
    description: "一个看起来很适合用来捕捉的武器",
    rarity: Rarity.Common,
    position: EquipmentPosition.Hand,
    extraActions: [{ actionType: ActionType.Capture, weight: 0.2 }],
    ability: {},
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: -1,
        multiply: 1,
      },
      [HitCategory.Capture]: {
        plus: 2,
        multiply: 1,
      },
    },
  },
  [EquipmentType.ShabbyKatana]: {
    name: "残破太刀",
    description: "太好了，有了这个，你就可以做虾头太刀侠了",
    rarity: Rarity.Common,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.Slash, weight: 0.9 },
      { actionType: ActionType.HorizontalSlash, weight: 0.05 },
      { actionType: ActionType.StepSlash, weight: 0.025 },
      { actionType: ActionType.Mikiri, weight: 0.01 },
      { actionType: ActionType.SpiritRoundslash, weight: 0.01 },
      { actionType: ActionType.Helmbreaker, weight: 0.005 },
    ],
    ability: {},
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
      [HitCategory.Dodge]: {
        plus: -1,
        multiply: 1,
      },
    },
  },
  [EquipmentType.GreatKatana]: {
    name: "大太刀",
    description: "这把的太刀的刀身比一般的太刀要长，挥舞起来很吃力但是威力巨大",
    rarity: Rarity.Rare,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.Slash, weight: 0.2 },
      { actionType: ActionType.HorizontalSlash, weight: 0.4 },
      { actionType: ActionType.StepSlash, weight: 0.3 },
      { actionType: ActionType.Mikiri, weight: 0.1 },
      { actionType: ActionType.SpiritRoundslash, weight: 0.05 },
      { actionType: ActionType.Helmbreaker, weight: 0.02 },
    ],
    ability: {
      str: 2,
      dex: -2,
    },
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 2,
        multiply: 1,
      },
      [HitCategory.Dodge]: {
        plus: -2,
        multiply: 1,
      },
    },
  },
  [EquipmentType.Ningenmukotsu]: {
    name: "太刀\"人间无骨\"",
    description: "正面刻着人间，背面刻着无骨的名刀。刀如其名，削骨若无物",
    rarity: Rarity.Epic,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.HorizontalSlash, weight: 0.3 },
      { actionType: ActionType.StepSlash, weight: 0.3 },
      { actionType: ActionType.Mikiri, weight: 0.3 },
      { actionType: ActionType.SpiritRoundslash, weight: 0.1 },
      { actionType: ActionType.Helmbreaker, weight: 0.05 },
    ],
    ability: {},
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 3,
        multiply: 1.1,
      },
    },
  },
  [EquipmentType.Mikadsukimunechika]: {
    name: "太刀\"三日月宗近\"",
    description: "太刀最高杰作的天下五剑之一，传说中的名刀，有着名物中的名物之称。刀身如同新月一般美丽",
    rarity: Rarity.Legendary,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.HorizontalSlash, weight: 0.3 },
      { actionType: ActionType.StepSlash, weight: 0.3 },
      { actionType: ActionType.Mikiri, weight: 0.3 },
      { actionType: ActionType.SpiritRoundslash, weight: 0.1 },
      { actionType: ActionType.Helmbreaker, weight: 0.15 },
    ],
    ability: {
      str: 1,
      dex: 1,
    },
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 10,
        multiply: 1,
      },
      [HitCategory.Dodge]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [EquipmentType.MudKnife]: {
    name: "沼气短刀",
    description: "刀身闻起来臭臭的",
    rarity: Rarity.Rare,
    position: EquipmentPosition.Hand,
    extraActions: [
      { actionType: ActionType.PowerfulDigAttack, weight: 0.2 },
      { actionType: ActionType.QuickAttack, weight: 0.8 },
    ],
    ability: {
      dex: 1,
    },
    actionCoeff: {
      [HitCategory.Dodge]: {
        plus: 1,
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
      [HitCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
      [HitCategory.Dodge]: {
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
      [HitCategory.Attack]: {
        plus: 2,
        multiply: 1,
      },
      [HitCategory.Defend]: {
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
      [HitCategory.Attack]: {
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
