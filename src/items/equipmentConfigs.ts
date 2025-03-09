import { EquipmentPosition, EquipmentData } from "./types";
import { ActionCategory } from "../actions/types";
import { ActionType } from "../actions/actionConfigs";

export const commonEquipmentConfigs: Record<string, EquipmentData> = {
  "sword": {
    name: "剑",
    description: "一把剑,平平无奇的武器",
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
}

export const rareEquipmentConfigs: Record<string, EquipmentData> = {
  "katana": {
    name: "太刀",
    description: "太好了，有了这个，你就可以做虾头太刀侠了",
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
