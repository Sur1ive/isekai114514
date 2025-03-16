import type { ActionType } from "./actionConfigs";

export enum HitCategory {
  Attack = "Attack",
  Defend = "Defend",
  Dodge = "Dodge",
  Capture = "Capture",
  Special = "Special",
  None = "None",
}

export interface ActionCoeff {
  str: number;
  int: number;
  con: number;
  siz: number;
  app: number;
  dex: number;
}

export interface WeightedActionType {
  actionType: ActionType;
  weight: number;
}
