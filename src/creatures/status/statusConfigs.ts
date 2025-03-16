import { StatusData, StatusCategory, StatusDurationType } from "./Status";
import { actionConfigs, ActionType, NoHit } from "../../actions/actionConfigs";
import type { Action } from "../../actions/Action";
import type { Creature } from "../Creature";
import type { Hit } from "../../actions/Action";

export enum StatusType {
  SpiritBlade = "SpiritBlade",
  RedBlade = "RedBlade",
  Pain = "Pain",
  Unbalance = "Unbalance",
}

export const statusConfigs: Record<StatusType, StatusData> = {
  [StatusType.SpiritBlade]: {
    name: "气刃",
    description: "可以释放气刃大回旋",
    durationType: StatusDurationType.Turn,
    category: StatusCategory.OnTurnStart,
    priority: 1,
    effect: (_self: Creature, action1: Action, action2: Action) => {
      action1 = actionConfigs[ActionType.SpiritRoundSlash];
      return { action1, action2 };
    },
  },
  [StatusType.RedBlade]: {
    name: "红刃",
    description: "可以释放登龙",
    durationType: StatusDurationType.Turn,
    category: StatusCategory.OnTurnStart,
    priority: 1,
    effect: (_self: Creature, action1: Action, action2: Action) => {
      action1 = actionConfigs[ActionType.HelmBreaker];
      return { action1, action2 };
    },
  },
  [StatusType.Pain]: {
    name: "痛苦",
    description: "有概率因痛苦而无法行动",
    durationType: StatusDurationType.Turn,
    category: StatusCategory.OnTurnStart,
    priority: 999,
    effect: (_self: Creature, action1: Action, action2: Action) => {
      if (Math.random() < 0.1) {
        action1 = actionConfigs[ActionType.Stun];
        action2 = actionConfigs[ActionType.Stun];
      }
      return { action1, action2 };
    },
  },
  [StatusType.Unbalance]: {
    name: "失衡",
    description: "重心不稳，丢失当前Hit",
    durationType: StatusDurationType.Hit,
    category: StatusCategory.OnHitStart,
    priority: 999,
    effect: (_self: Creature, _hit: Hit) => {
      return NoHit;
    },
  },
};
