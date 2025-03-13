import type { ConsumableType } from "./consumableConfigs";
import type { EquipmentType } from "./equipmentConfigs";
import type { Ability } from "../creatures/types";
import type { ActionCategory, WeightedActionType } from "../actions/types";
import type { Creature } from "../creatures/Creature";
import type { Rarity } from "../types";
export enum ItemCategory {
  Consumable = "Consumable",
  Equipment = "Equipment",
}

export interface EquipmentActionCoeffValue {
  plus: number;
  multiply: number;
}

// todo: 给各个前缀添加效果和出率权重
export enum EquipmentPrefix {
  None = "",
  Big = "巨大的",
  Smelly = "野兽先辈的",
}

export enum EquipmentPosition {
  Head = "head",
  Body = "body",
  Hand = "hand",
  Foot = "foot",
  Accessory = "accessory",
}

export type ItemType = EquipmentType | ConsumableType;

export type EquipmentAbility = Partial<Ability>;

export type EquipmentActionCoeff = Partial<
  Record<ActionCategory, EquipmentActionCoeffValue>
>;

export interface EquipmentData {
  name: string;
  description: string;
  rarity: Rarity;
  position: EquipmentPosition;
  extraActions: WeightedActionType[];
  ability: EquipmentAbility;
  actionCoeff: EquipmentActionCoeff;
}

export interface ConsumableData {
  name: string;
  description: string;
  rarity: Rarity;
  effect: (target: Creature) => void;
}
