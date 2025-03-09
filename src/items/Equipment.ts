import { Item } from "./Item";
import type { WeightedActionType } from "../actions/types";
import { EquipmentPosition, EquipmentAbility, EquipmentActionCoeff, EquipmentData, EquipmentPrefix, Rarity, ItemIdentifier } from "./types";
import { commonEquipmentConfigs, rareEquipmentConfigs } from "./equipmentConfigs";

export class Equipment extends Item {
  position: EquipmentPosition;
  extraActions: WeightedActionType[];
  ability: EquipmentAbility;
  actionCoeff: EquipmentActionCoeff;
  prefix: EquipmentPrefix;

  constructor(identifier: ItemIdentifier) {
    super(identifier);
    let data: EquipmentData;
    switch (identifier.type.rarity) {
      case Rarity.Common:
        data = commonEquipmentConfigs[identifier.type.key];
        break;
      case Rarity.Rare:
        data = rareEquipmentConfigs[identifier.type.key];
        break;
      default:
        throw new Error("Invalid rarity");
    }
    this.name = identifier.prefix ? identifier.prefix + data.name : data.name;
    this.description = data.description;
    this.position = data.position;
    this.extraActions = data.extraActions;
    this.ability = data.ability;
    this.actionCoeff = data.actionCoeff;
    this.prefix = identifier.prefix || EquipmentPrefix.None;
  }
}
