import { EquipmentPosition, EquipmentData } from "./types";
import { ActionCategory } from "../actions/types";
import { ActionType } from "../actions/actionConfigs";
import { Rarity } from "./types";

export enum EquipmentType {
  Sword = "Sword",
  Katana = "Katana",
}

export const equipmentConfigs: Record<EquipmentType, EquipmentData> = {
  [EquipmentType.Sword]: {
    name: "剑",
    description: "一把剑,平平无奇的武器",
    rarity: Rarity.Common,
    position: EquipmentPosition.Hand,
    extraActions: [],
    ability: {},
    actionCoeff: {
      [ActionCategory.Attack]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
  [EquipmentType.Katana]: {
    name: "太刀",
    description: "太好了，有了这个，你就可以做虾头太刀侠了",
    rarity: Rarity.Rare,
    position: EquipmentPosition.Hand,
    extraActions: [{actionType: ActionType.HorizontalSlash, weight: 1}],
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
}
