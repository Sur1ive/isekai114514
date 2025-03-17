import type { Action, Hit } from "../../actions/Action";
import type { Creature } from "../Creature";
import type { StatusType } from "./statusConfigs";
export enum StatusDurationType {
  Permanent = "Permanent", // 永久
  Turn = "Turn", // 回合结算完毕时-1
  Action = "Action", // 动作结算完毕时-1
  Hit = "Hit", // hit结算完毕时-1
}

export enum StatusCategory {
  // OnApply = "OnApply", // 立刻生效
  OnTurnStart = "OnTurnStart", // 回合开始时生效
  // OnActionStart = "OnActionStart", // 动作开始时生效
  OnHitStart = "OnHitStart", // hit开始时生效
}

export type StatusEffectMap = {
  // [StatusCategory.OnApply]: (self: Creature, statusLevel?: number) => void;
  [StatusCategory.OnTurnStart]: (
    self: Creature,
    action1: Action,
    action2: Action,
    statusLevel?: number,
  ) => { action1: Action; action2: Action };
  // [StatusCategory.OnActionStart]: (
  //   self: Creature,
  //   action: Action,
  //   statusLevel?: number,
  // ) => void;
  [StatusCategory.OnHitStart]: (
    self: Creature,
    hit: Hit,
    statusLevel?: number,
  ) => Hit;
};

export interface StatusData<T extends StatusCategory = StatusCategory> {
  name: string;
  description: string;
  priority: number;
  durationType: StatusDurationType;
  category: T;
  effect: StatusEffectMap[T];
}

export interface Status{
  name: string;
  description: string;
  type: StatusType;
  priority: number;
  durationType: StatusDurationType;
  category: StatusCategory;
  duration: number;
  statusLevel?: number;
}
