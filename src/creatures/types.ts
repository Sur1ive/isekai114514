import type { WeightedActionType } from "../actions/types";
import type { ItemType } from "../items/types";
import type { Equipment } from "../items/Equipment";
import type { StatusType } from "../creatures/status/statusConfigs";

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
  piercing: Coefficient;
}

export interface Ability {
  str: number;
  int: number;
  con: number;
  siz: number;
  app: number;
  dex: number;
  armor: number;
  piercing: number;
}

export interface CreatureData {
  typeName: string;
  abilityCoeff: AbilityCoefficient;
  actions: WeightedActionType[];
  dropItems: { type: ItemType | null; weight: number }[];
  description: string;
  initStatus?: { type: StatusType; duration: number }[];
  image?: string;
}

export interface EquipmentBar {
  body: Equipment | null;
  hand: Equipment | null;
  foot: Equipment | null;
  accessory: Equipment | null;
}
