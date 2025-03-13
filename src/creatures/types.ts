import type { WeightedActionType } from "../actions/types";
import type { ItemType } from "../items/types";
import type { Equipment } from "../items/Equipment";

export interface Range {
  min: number;
  max: number;
}

export interface Coefficient {
  base: number;
  growth: number;
}

export interface AbilityCoefficient {
  str: Coefficient;
  int: Coefficient;
  con: Coefficient;
  siz: Coefficient;
  app: Coefficient;
  dex: Coefficient;
  armor: Coefficient;
}

export interface Ability {
  str: number;
  int: number;
  con: number;
  siz: number;
  app: number;
  dex: number;
  armor: number;
}

export interface CreatureData {
  typeName: string;
  abilityCoeff: AbilityCoefficient;
  actions: WeightedActionType[];
  dropItems: { type: ItemType | null; weight: number }[];
  description: string;
}

export enum CreatureStatusType {
  Poison = "poison",
  Sleep = "sleep",
  Stun = "stun",
  Confuse = "confuse",
  Paralyze = "paralyze",
  Pain = "pain",
}

export interface CreatureStatus {
  type: CreatureStatusType;
  duration: number;
}

export interface EquipmentBar {
  head: Equipment | null;
  body: Equipment | null;
  hand: Equipment | null;
  foot: Equipment | null;
  accessory: Equipment | null;
}
