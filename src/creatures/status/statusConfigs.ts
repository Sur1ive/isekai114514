import { StatusData, StatusCategory, StatusDurationType } from "./Status";
import { actionConfigs, ActionType, NoHit } from "../../actions/actionConfigs";
import type { Action } from "../../actions/Action";
import type { Creature } from "../Creature";
import type { Hit } from "../../actions/Action";
import { Player } from "../Player";

export enum StatusType {
  SpiritBlade = "SpiritBlade",
  RedBlade = "RedBlade",
  Pain = "Pain",
  Unbalance = "Unbalance",
  Wound = "Wound",
  Burning = "Burning",
  QuickRecovery = "QuickRecovery",
  Dizzy = "Dizzy",
  Escaped = "Escaped",
  WillEscape = "WillEscape",
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
  [StatusType.Dizzy]: {
    name: "头晕眼花",
    description: "丢失当回合所有hit",
    durationType: StatusDurationType.Turn,
    category: StatusCategory.OnHitStart,
    priority: 999,
    effect: (_self: Creature, _hit: Hit) => {
      return NoHit;
    },
  },
  [StatusType.Wound]: {
    name: "创伤",
    description: "每次行动(hit)都会损失一定生命值",
    durationType: StatusDurationType.Turn,
    category: StatusCategory.OnHitStart,
    priority: 999,
    effect: (self: Creature, hit: Hit, level?: number) => {
      self.loseHp(level || 1);
      return hit;
    },
  },
  [StatusType.Burning]: {
    name: "燃烧",
    description: "每回合损失一定生命值",
    durationType: StatusDurationType.Turn,
    category: StatusCategory.OnTurnStart,
    priority: 999,
    effect: (self: Creature, action1: Action, action2: Action, level?: number) => {
      self.loseHp(level || 1);
      return { action1, action2 };
    },
  },
  [StatusType.QuickRecovery]: {
    name: "快速恢复",
    description: "自动回复速度大幅度增加",
    durationType: StatusDurationType.Second,
    category: StatusCategory.OnSecond,
    priority: 1,
    effect: (self: Creature, statusLevel?: number) => {
      (self as Player).autoRecoverHpDot(statusLevel || 1);
    },
  },
  [StatusType.Escaped]: {
    name: "跑掉了",
    description: "ta逃走了...",
    durationType: StatusDurationType.Turn,
    category: StatusCategory.OnTurnStart,
    priority: 999,
    effect: (_self: Creature, action1: Action, action2: Action) => {
      return { action1, action2 };
    },
  },
  [StatusType.WillEscape]: {
    name: "将要逃跑",
    description: "ta即将逃跑...",
    durationType: StatusDurationType.Turn,
    category: StatusCategory.OnTurnStart,
    priority: 999,
    effect: (self: Creature, action1: Action, action2: Action) => {
      // 检查WillEscape状态的剩余回合数，如果为1，则设置为Escaped状态。
      // 如果有多个WillEscape状态，剩余回合数按最小计算。
      const escapeStatusList = self.statuses.filter(status => status.type === StatusType.WillEscape);
      const turnsUntilEscape = escapeStatusList.reduce((min, status) => Math.min(min, status.duration), Infinity);
      if (turnsUntilEscape === 1) {
        self.addStatus(StatusType.Escaped, 999);
      }
      return { action1, action2 };
    },
  },
};
