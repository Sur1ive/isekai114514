import { Creature } from "../creatures/Creature";

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

export interface Action {
  name: string;
  description: string;
  type: ActionType;
  coeff: ActionCoeff;   // 属性系数
  extraEffect?: (actor: Creature, target: Creature) => void;  // 额外效果
  messageGenerator: (actor: Creature, target: Creature, result: ActionResult) => string;
  }
