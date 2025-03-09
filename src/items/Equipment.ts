import { Item } from "./Item";
import type { WeightedActionType } from "../actions/types";
import { EquipmentPosition, EquipmentAbility, EquipmentActionCoeff, EquipmentPrefix, ItemCategory } from "./types";
import { equipmentConfigs, EquipmentType } from "./equipmentConfigs";
import { v4 as uuidv4 } from 'uuid';
import { generateRandomPrefix } from "./equipmentUtils";

export class Equipment extends Item {
  position: EquipmentPosition;
  extraActions: WeightedActionType[];
  ability: EquipmentAbility;
  actionCoeff: EquipmentActionCoeff;
  prefix: EquipmentPrefix;

  constructor(type: EquipmentType) {
    type = type || EquipmentType.Sword;
    const data = equipmentConfigs[type];
    super(data.name, uuidv4(), ItemCategory.Equipment, type, data.rarity, data.description);

    this.position = data.position;
    this.extraActions = data.extraActions;
    this.ability = data.ability;
    this.actionCoeff = data.actionCoeff;
    this.prefix = generateRandomPrefix();
  }
}
