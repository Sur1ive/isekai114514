import type { ActionType } from "./actionConfigs";

export enum ActionCategory {
  Attack = "attack",
  Defend = "defend",
  Dodge = "dodge",
  Capture = "capture",
  DexAction = "dexAction",
  StrAction = "strAction",
  IntAction = "intAction",
  ConAction = "conAction",
  SizAction = "sizAction",
  AppAction = "appAction",
  NoAction = "noAction",
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
