import { Action, ActionType, ActionResult } from "./Action";
import { Creature } from "../creatures/Creature";
import { CreatureStatusType } from "../creatures/CreatureStatus";

export const actionConfigs: Record<string, Action> = {
  dazedAction: {
    name: "失神",
    type: ActionType.NoAction,
    coeff: {
      str: 0,
      int: 0,
      con: 0,
      siz: 0,
      app: 0,
      dex: 0,
    },
    messageGenerator: (actor: Creature, target: Creature, result: ActionResult) => `${actor.name} 愣了一下，什么也没做`,
  },

  attackAction: {
    name: "攻击",
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
    type: ActionType.Attack,
    coeff: {
      str: 10,
      int: 0,
      con: 0,
      siz: 10,
      app: 10,
      dex: 0,
    },
    extraEffect: (actor: Creature, target: Creature) => {
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
    type: ActionType.Attack,
    coeff: {
      str: 5,
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

}

