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
  ABitHoly = "ABitHoly",
  BeastHeart = "BeastHeart",
  DragonForge = "DragonForge",
  Sneaky = "Sneaky",
  Weak = "Weak",
  Strange = "Strange",
  Small = "Small",
  Sturdy = "Sturdy",
  Bold = "Bold",
  Cursed = "Cursed",
  Elaborate = "Elaborate",
  VillageBest = "VillageBest",
  Shiny = "Shiny",
  Quick = "Quick",
  Powerful = "Powerful",
  Elegant = "Elegant",
  Handy = "Handy",
  BlackAdvanced = "BlackAdvanced",
  Blessed = "Blessed",
  RageCursed = "RageCursed",
  Weighty = "Weighty",

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
  [PrefixType.Cursed]: {
    name: "被诅咒的",
    position: "AnyPosition",
    rarity: Rarity.Common,
    extraActions: [],
    ability: {
      con: -1,
    },
    actionCoeff: {},
  },
  [PrefixType.Weak]: {
    name: "虚弱的",
    position: "AnyPosition",
    rarity: Rarity.Common,
    extraActions: [],
    ability: {
      str: -1,
    },
    actionCoeff: {},
  },
  [PrefixType.Strange]: {
    name: "古怪的",
    position: "AnyPosition",
    rarity: Rarity.Common,
    extraActions: [],
    ability: {
      int: -1,
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
        plus: 1,
        multiply: 1,
      },
      [HitCategory.Dodge]: {
        plus: -1,
        multiply: 1,
      },
    },
  },
  [PrefixType.Small]: {
    name: "小巧的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Common,
    extraActions: [],
    ability: {},
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: -1,
        multiply: 1,
      },
      [HitCategory.Dodge]: {
        plus: 1,
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
  [PrefixType.Sturdy]: {
    name: "结实的",
    position: "AnyPosition",
    rarity: Rarity.Common,
    extraActions: [],
    ability: {},
    actionCoeff: {
      [HitCategory.Defend]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [PrefixType.Sneaky]: {
    name: "卑鄙的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Common,
    extraActions: [
      { actionType: ActionType.SneakAttack, weight: 0.2 },
    ],
    ability: {},
    actionCoeff: {},
  },
  [PrefixType.Sharp]: {
    name: "锐利的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Common,
    extraActions: [],
    ability: {
      piercing: 5,
    },
    actionCoeff: {},
  },
  [PrefixType.Bold]: {
    name: "莽撞的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Common,
    extraActions: [
      { actionType: ActionType.Attack, weight: 0.5 },
    ],
    ability: { str: 1 },
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [PrefixType.Elaborate]: {
    name: "精制的",
    position: "AnyPosition",
    rarity: Rarity.Rare,
    extraActions: [],
    ability: {
      piercing: 5,
      armor: 5,
    },
    actionCoeff: {},
  },
  [PrefixType.ABitHoly]: {
    name: "有点神圣的",
    position: "AnyPosition",
    rarity: Rarity.Rare,
    extraActions: [
      { actionType: ActionType.Repent, weight: 0.1 },
    ],
    ability: {},
    actionCoeff: {},
  },
  [PrefixType.VillageBest]: {
    name: "村里最好的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Rare,
    extraActions: [],
    ability: {},
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [PrefixType.RageCursed]: {
    name: "狂化诅咒的",
    position: "AnyPosition",
    rarity: Rarity.Rare,
    extraActions: [],
    ability: {
      con: -1,
      int: -1,
      str: 1,
    },
    actionCoeff: {
      [HitCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [PrefixType.Shiny]: {
    name: "闪亮的",
    position: "AnyPosition",
    rarity: Rarity.Rare,
    extraActions: [],
    ability: {
      piercing: 5,
    },
    actionCoeff: {
      [HitCategory.Dodge]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [PrefixType.Weighty]: {
    name: "沉甸甸的",
    position: "AnyPosition",
    rarity: Rarity.Rare,
    extraActions: [],
    ability: {
      con: 1,
      dex: -1,
      armor: 5,
    },
    actionCoeff: {
      [HitCategory.Defend]: {
        plus: 1,
        multiply: 1,
      },
      [HitCategory.Dodge]: {
        plus: -1,
        multiply: 1,
      },
    },
  },
  [PrefixType.Quick]: {
    name: "迅捷的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Rare,
    extraActions: [
      { actionType: ActionType.QuickAttack, weight: 0.2 },
    ],
    ability: {
      dex: 1,
    },
    actionCoeff: {},
  },
  [PrefixType.Powerful]: {
    name: "强力的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Rare,
    extraActions: [
      { actionType: ActionType.PowerAttack, weight: 0.2 },
    ],
    ability: {
      str: 1,
    },
    actionCoeff: {},
  },
  [PrefixType.Elegant]: {
    name: "优雅的",
    position: "AnyPosition",
    rarity: Rarity.Rare,
    extraActions: [],
    ability: {
      int: 1,
    },
    actionCoeff: {},
  },
  [PrefixType.Handy]: {
    name: "趁手的",
    position: EquipmentPosition.Hand,
    rarity: Rarity.Rare,
    extraActions: [],
    ability: {
      piercing: 10,
    },
    actionCoeff: {},
  },
  [PrefixType.BlackAdvanced]: {
    name: "黑色高级的",
    position: "AnyPosition",
    rarity: Rarity.Masterpiece,
    extraActions: [],
    ability: {
      armor: 10,
      piercing: 10,
    },
    actionCoeff: {},
  },
  [PrefixType.Blessed]: {
    name: "祝福的",
    position: "AnyPosition",
    rarity: Rarity.Masterpiece,
    extraActions: [],
    ability: {
      con: 2,
      armor: 5,
    },
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
  // [PrefixType.BloodCursed]: {
  //   name: "嗜血诅咒之",
  //   position: EquipmentPosition.Hand,
  //   rarity: Rarity.Masterpiece,
  //   extraActions: [],
  //   ability: {
  //     str: 2,
  //     con: -2,
  //     piercing: 5,
  //   },
  //   actionCoeff: {
  //     [HitCategory.Attack]: {
  //       plus: 2,
  //       multiply: 1,
  //     },
  //   },
  // },
  // [PrefixType.Bloodthirsty]: {
  //   name: "鲜血饥渴 ",
  //   position: EquipmentPosition.Hand,
  //   rarity: Rarity.Epic,
  //   extraActions: [
  //     { actionType: ActionType.Repent, weight: 0.1 },
  //     { actionType: ActionType.GodStrike, weight: 0.01 },
  //   ],
  //   ability: {
  //     piercing: 10,
  //   },
  //   actionCoeff: {
  //     [HitCategory.Attack]: {
  //       plus: 1,
  //       multiply: 1,
  //     },
  //   },
  // },
  // [PrefixType.GodBlessed]: {
  //   name: "神佑 ",
  //   position: EquipmentPosition.Hand,
  //   rarity: Rarity.Epic,
  //   extraActions: [
  //     { actionType: ActionType.Repent, weight: 0.1 },
  //     { actionType: ActionType.GodStrike, weight: 0.01 },
  //   ],
  //   ability: {
  //     piercing: 10,
  //   },
  //   actionCoeff: {
  //     [HitCategory.Attack]: {
  //       plus: 1,
  //       multiply: 1,
  //     },
  //   },
  // },
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
