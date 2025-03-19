import { Rarity } from "../types";
import { Prefix } from "./Prefix";
import { EquipmentPosition } from "./types";
import { HitCategory } from "../actions/types";
import { ActionType } from "../actions/actionConfigs";

export enum PrefixType {
  None = "None",
  Heavy = "Heavy",
  Light = "Light",
  Sharp = "Sharp",
  Huge = "Huge",
  Masterpiece = "Masterpiece",
  Mythical = "Mythical",
  Epic = "Epic",
  Holy = "Holy",
  BeastHeart = "BeastHeart",
  DragonForge = "DragonForge",
}

export const prefixConfigs: Record<PrefixType, Prefix> = {
  [PrefixType.None]: {
    name: "",
    position: "AnyPosition",
    rarity: Rarity.Common,
    extraActions: [],
    ability: {},
    actionCoeff: {},
  },
  [PrefixType.Heavy]: {
    name: "笨重的",
    position: "AnyPosition",
    rarity: Rarity.Common,
    extraActions: [],
    ability: {
      dex: -1,
    },
    actionCoeff: {},
  },
  [PrefixType.Huge]: {
    name: "巨大的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Common,
    extraActions: [],
    ability: {},
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 2,
        multiply: 1,
      },
      [HitCategory.Dodge]: {
        plus: -1,
        multiply: 1,
      },
    },
  },
  [PrefixType.Light]: {
    name: "轻巧的",
    position: "AnyPosition",
    rarity: Rarity.Common,
    extraActions: [],
    ability: {},
    actionCoeff: {
      [HitCategory.Dodge]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [PrefixType.Sharp]: {
    name: "锐利的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Rare,
    extraActions: [],
    ability: {
      piercing: 1,
    },
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [PrefixType.Holy]: {
    name: "有点神圣的",
    position: "AnyPosition",
    rarity: Rarity.Rare,
    extraActions: [
      { actionType: ActionType.Repent, weight: 0.1 },
    ],
    ability: {},
    actionCoeff: {},
  },
  [PrefixType.BeastHeart]: {
    name: "野兽之心 ",
    position: "AnyPosition",
    rarity: Rarity.Masterpiece,
    extraActions: [
      { actionType: ActionType.PowerfulDigAttack, weight: 0.3 },
    ],
    ability: {
      con: 1
    },
    actionCoeff: {},
  },
  [PrefixType.Masterpiece]: {
    name: "大师的杰作 ",
    position: "AnyPosition",
    rarity: Rarity.Masterpiece,
    extraActions: [],
    ability: {
      con: 1,
      piercing: 5,
      armor: 5,
    },
    actionCoeff: {
      [HitCategory.Dodge]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [PrefixType.DragonForge]: {
    name: "龙息锻造的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Epic,
    extraActions: [
      { actionType: ActionType.DragonBreath, weight: 0.1 },
    ],
    ability: {
      piercing: 10,
    },
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 2,
        multiply: 1,
      },
    },
  },
  [PrefixType.Epic]: {
    name: "吟游诗人的歌谣中的",
    position: "AnyPosition",
    rarity: Rarity.Epic,
    extraActions: [],
    ability: {
      piercing: 10,
      armor: 10,
    },
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 2,
        multiply: 1,
      },
      [HitCategory.Defend]: {
        plus: 2,
        multiply: 1,
      },
    },
  },
  [PrefixType.Mythical]: {
    name: "神话时代的遗留物 ",
    position: "AnyPosition",
    rarity: Rarity.Mythical,
    extraActions: [],
    ability: {
      str: 1,
      dex: 1,
      app: 1,
      siz: 1,
      con: 1,
      int: 1,
      piercing: 5,
      armor: 5,
    },
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
      [HitCategory.Defend]: {
        plus: 1,
        multiply: 1,
      },
      [HitCategory.Dodge]: {
        plus: 1,
        multiply: 1,
      },
      [HitCategory.Capture]: {
        plus: 1,
        multiply: 1,
      },
      [HitCategory.Special]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
};
