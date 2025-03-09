import type { actionConfigs } from "./actionConfigs";

export enum ActionType {
  Attack = "attack",
  Defend = "defend",
  Dodge = "dodge",
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

export enum ActionResult {
  Success = "success",
  Fail = "fail",
  Miss = "miss",
}

export type ActionKey = keyof typeof actionConfigs;

export interface WeightedActionKey {
  actionKey: ActionKey;
  weight: number;
}
