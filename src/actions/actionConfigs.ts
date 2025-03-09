import type { Action } from "./Action";
import type { Creature } from "../creatures/Creature";
import { Player } from "../creatures/Player";
import { CreatureStatusType } from "../creatures/types";
import { ActionType, ActionResult, ActionKey } from "./types";

export const actionConfigs: Record<string, Action> = {
  dazedAction: {
    name: "失神",
    description: "愣了一下",
    type: ActionType.NoAction,
    coeff: {
      str: 0,
      int: 0,
      con: 0,
      siz: 0,
      app: 0,
      dex: 0,
    },
    messageGenerator: (actor: Creature, _target: Creature, _result: ActionResult) => `${actor.name} 愣了一下，什么也没做`,
  },

  attackAction: {
    name: "攻击",
    description: "用拳头或者用武器进行一般通过攻击",
    type: ActionType.Attack,
    coeff: {
      str: 1,
      int: 0,
      con: 0,
      siz: 0.5,
      app: 0,
      dex: 0.5,
    },
    messageGenerator: (actor: Creature, target: Creature, result: ActionResult) => {
      if (result === ActionResult.Success) {
        return `${actor.name}攻击了${target.name}`;
      } else {
        return `${actor.name}攻击了${target.name}，但是失败了`;
      }
    },
  },

  powerfulDigAttackAction: {
    name: "狠狠地撅",
    description: "1！1！4！5！1！4！",
    type: ActionType.Attack,
    coeff: {
      str: 10,
      int: 0,
      con: 0,
      siz: 10,
      app: 10,
      dex: 0,
    },
    extraEffect: (_actor: Creature, target: Creature) => {
      target.status.push({
        type: CreatureStatusType.Pain,
        duration: 10,
      });
    },
    messageGenerator: (actor: Creature, target: Creature, result: ActionResult) => {
      if (result === ActionResult.Success) {
        return `${actor.name}狠狠地撅了${target.name}一下，${target.name}痛苦难耐\n\/\/ 哼哼啊啊啊啊啊啊啊啊啊啊 `;
      } else {
        return `${target.name}躲过了${actor.name}的撅`;
      }
    },
  },

  // 横劈
  horizontalSlashAction: {
    name: "横劈",
    description: "以迅猛之势横劈出一刀",
    type: ActionType.Attack,
    coeff: {
      str: 4,
      int: 0,
      con: 0,
      siz: 0,
      app: 0,
      dex: 2,
    },
    messageGenerator: (actor: Creature, target: Creature, result: ActionResult) => {
      if (result === ActionResult.Success) {
        return `${actor.name}以迅猛之势横劈出一刀`;
      } else {
        return `${target.name}躲过了${actor.name}的横劈`;
      }
    },
  },

  // 撕咬
  biteAction: {
    name: "撕咬",
    description: "用嘴撕咬，一种原始的攻击方式",
    type: ActionType.Attack,
    coeff: {
      str: 2,
      int: 0,
      con: 0,
      siz: 1,
      app: 0,
      dex: 1,
    },
    messageGenerator: (actor: Creature, target: Creature, result: ActionResult) => {
      if (result === ActionResult.Success) {
        return `${actor.name}冲过来咬了${target.name}一口`;
      } else {
        return `${target.name}躲过了${actor.name}的撕咬`;
      }
    },
  },

  // 捕捉
  captureAction: {
    name: "尝试捕捉",
    description: "这不是神奇宝贝，你得用绞技而不是精灵球",
    type: ActionType.Attack,
    coeff: {
      str: 1,
      int: 0,
      con: 0,
      siz: 0,
      app: 0,
      dex: 0,
    },
    extraEffect: (actor: Creature, target: Creature) => {
      // actor不是玩家，则不进行任何操作
      if (!(actor instanceof Player)) {
        return;
      }
      if (target.health < 1) {
        actor.addLog(`${target.name}已经死了，无法捕获`);
        return;
      }
      // 否则进行两次概率判定
      const dexSuccessRate = (actor.ability.dex / target.ability.dex) * (actor.ability.siz / target.ability.siz) / (10 * target.health / target.maxHealth);
      const strSuccessRate = (actor.ability.str / target.ability.str) * (actor.ability.siz / target.ability.siz) / (10 * target.health / target.maxHealth);
      if (Math.random() < strSuccessRate && Math.random() < dexSuccessRate) {
        target.health = 0.9;
        actor.capturedMonster.push({name: target.name, level: target.level});
        actor.addLog(`你成功捕获了${target.name}`);
      } else {
        actor.addLog(`你尝试捕获${target.name}，但是失败了`);
      }
    },
    messageGenerator: (actor: Creature, target: Creature, result: ActionResult) => {
      if (result === ActionResult.Success) {
        return `${actor.name}尝试通过绞住${target.name}，让${target.name}失去行动力`;
      } else {
        return `${target.name}躲过了${actor.name}的绞技`;
      }
    },
  },
}

export function getAction(key: ActionKey) {
  return actionConfigs[key];
}
