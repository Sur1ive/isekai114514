import type { ConsumableType } from "./consumableConfigs";
import type { EquipmentType } from "./equipmentConfigs";
import type { Ability } from "../creatures/types";
import type { HitCategory, WeightedActionType } from "../actions/types";
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

export enum EquipmentPosition {
  Body = "body",
  Hand = "hand",
  Foot = "foot",
  Accessory = "accessory",
}

export type ItemType = EquipmentType | ConsumableType;

export type EquipmentAbility = Partial<Ability>;

export type EquipmentActionCoeff = Partial<
  Record<HitCategory, EquipmentActionCoeffValue>
>;

export interface EquipmentData {
  name: string;
  description: string;
  rarity: Rarity;
  position: EquipmentPosition;
  extraActions: WeightedActionType[];
  ability: EquipmentAbility;
  armorGrowthCoeff: number;
  piercingGrowthCoeff: number;
  actionCoeff: EquipmentActionCoeff;
  canNotObtainFromChest?: boolean;
}

export interface ConsumableData {
  name: string;
  description: string;
  rarity: Rarity;
  effect: (target: Creature, level: number) => void;
  canNotBeUsed?: boolean;
}
