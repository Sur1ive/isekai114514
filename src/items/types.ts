import type { commonConsumableConfigs, rareConsumableConfigs } from "./consumableConfigs";
import type { commonEquipmentConfigs, rareEquipmentConfigs } from "./equipmentConfigs";
import type { Ability } from "../creatures/types";
import type { ActionCategory, WeightedActionType } from "../actions/types";
import type { Creature } from "../creatures/Creature";

export type ItemCategory = "consumable" | "equipment";

export enum Rarity {
	Common = 0,
  Rare = 1,
  Epic = 2,
  Legendary = 3,
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
}

export type ConsumableKey = keyof typeof commonConsumableConfigs | keyof typeof rareConsumableConfigs;
export type EquipmentKey = keyof typeof commonEquipmentConfigs | keyof typeof rareEquipmentConfigs;

export interface ItemType {
	category: ItemCategory;
	rarity: Rarity;
	key: EquipmentKey | ConsumableKey;
}

export interface ItemIdentifier {
	id: string;
	type: ItemType;
	prefix?: EquipmentPrefix;
}

export type EquipmentAbility = Partial<Ability>;

export type EquipmentActionCoeff = Partial<Record<ActionCategory, EquipmentActionCoeffValue>>;

export interface EquipmentData {
  name: string;
  description: string;
  position: EquipmentPosition;
  extraActions: WeightedActionType[];
  ability: EquipmentAbility;
  actionCoeff: EquipmentActionCoeff;
}

export interface ConsumableData {
  name: string;
  description: string;
  effect: (target: Creature) => void;
}
