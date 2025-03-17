import { Rarity } from "../types";
import { WeightedActionType } from "../actions/types";
import { EquipmentAbility, EquipmentActionCoeff, EquipmentPosition } from "./types";

export interface Prefix {
  name: string;
  description: string;
  position: EquipmentPosition | "AnyPosition";
  rarity: Rarity;
  extraActions: WeightedActionType[];
  ability: EquipmentAbility;
  actionCoeff: EquipmentActionCoeff;
}
