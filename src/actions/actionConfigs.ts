import type { Action, Hit } from "./Action";
import type { Creature } from "../creatures/Creature";
import { Player } from "../creatures/Player";
import { CreatureStatusType } from "../creatures/types";
import { ActionCategory } from "./types";
import type { Monster } from "../creatures/Monster";
import { Rarity } from "../types";

export enum ActionType {
  Dazed = "Dazed",
  Attack = "Attack",
  PowerAttack = "PowerAttack",
  QuickAttack = "QuickAttack",
  PowerfulDigAttack = "PowerfulDigAttack",
  HorizontalSlash = "HorizontalSlash",
  Bite = "Bite",
  Capture = "Capture",
  Stun = "Stun",
  Defend = "Defend",
  Dodge = "Dodge",
  DragonBreath = "DragonBreath",
  SpinAttack = "SpinAttack",
  DefenseSlash = "DefenseSlash",
  Counter = "Counter",
  GodStrike = "GodStrike",
  ShredFlower = "ShredFlower",
}

export const NoHit: Hit = {
  category: ActionCategory.NoAction,
  coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
  messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 来不及反应`,
};

export const actionConfigs: Record<ActionType, Action> = {
  [ActionType.Dazed]: {
    name: "反应不过来",
    description: "来不及反应",
    rarity: Rarity.Common,
    hits: [
      {
        category: ActionCategory.NoAction,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 来不及反应`,
      },
    ],
  },

  [ActionType.Stun]: {
    name: "眩晕",
    description: "眩晕",
    rarity: Rarity.Common,
    hits: [
      {
        category: ActionCategory.NoAction,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 眩晕了`,
      },
    ],
  },

  [ActionType.Attack]: {
    name: "攻击",
    description: "用拳头或者用武器进行一般通过攻击",
    rarity: Rarity.Common,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0.5, app: 0, dex: 0.5 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}攻击了${target.name}`;
        },
      },
    ],
  },

  [ActionType.PowerAttack]: {
    name: "强力攻击",
    description: "全身力量集中于一点，进行一次强力的攻击",
    rarity: Rarity.Rare,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 2, int: 0, con: 0, siz: 0.5, app: 0, dex: 0.5 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}对${target.name}发起了一次强力的攻击`;
        },
      },
    ],
  },
  [ActionType.QuickAttack]: {
    name: "迅击",
    description: "据说剑圣在一个呼吸间就能劈出数刀。虽然你不是剑圣，但你努努力也至少能劈出两刀",
    rarity: Rarity.Rare,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}以迅雷不及掩耳之势向${target.name}发起了攻势`;
        },
      },
      {
        category: ActionCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `电光火石之间，${actor.name}再次做出了攻击`;
        },
      },
    ],
  },

  [ActionType.PowerfulDigAttack]: {
    name: "狠狠地撅",
    description: "1！1！4！5！1！4！",
    rarity: Rarity.Legendary,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 6, int: 0, con: 0, siz: 3, app: 0, dex: 0 },
        extraEffect: (_actor: Creature, target: Creature) => {
          target.status.push({
            type: CreatureStatusType.Pain,
            duration: 10,
          });
        },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}狠狠地撅了${target.name}一下，${target.name}痛苦难耐\n\/\/ 哼哼啊啊啊啊啊啊啊啊啊啊 `;
        },
      },
    ],
  },

  // 横劈
  [ActionType.HorizontalSlash]: {
    name: "横劈",
    description: "以迅猛之势横向劈出一刀",
    rarity: Rarity.Epic,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 2, int: 0, con: 0, siz: 0, app: 0, dex: 2 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `${actor.name}以迅猛之势横向劈出一刀`;
        },
      },
    ],
  },

  // 撕咬
  [ActionType.Bite]: {
    name: "撕咬",
    description: "野兽的原始攻击方式",
    rarity: Rarity.Common,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0.5, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}冲过来咬了${target.name}一口`;
        },
      },
    ],
  },

  // 捕捉
  [ActionType.Capture]: {
    name: "尝试捕捉",
    description: "这不是神奇宝贝，你得用绞技而不是精灵球",
    rarity: Rarity.Common,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 0.5 },
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
            actor.capturedMonster.push(target as Monster);
            actor.addLog(`你成功捕获了${target.name}`);
          } else {
            actor.addLog(`你尝试捕获${target.name}，但是失败了`);
          }
        },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}尝试通过绞住${target.name}，让${target.name}失去行动力`;
        },
      },
    ],
  },

  [ActionType.Defend]: {
    name: "格挡",
    description: "做一个稳重的人",
    rarity: Rarity.Common,
    hits: [
      {
        category: ActionCategory.Defend,
        coeff: { str: 1, int: 0, con: 1, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 进行了防御`,
      },
    ],
  },

  [ActionType.Counter]: {
    name: "反击",
    description: "格挡后乘势反击",
    rarity: Rarity.Rare,
    hits: [
      {
        category: ActionCategory.Defend,
        coeff: { str: 0.5, int: 0, con: 1, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 进行了防御`,
      },
      {
        category: ActionCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 进行了反击`,
      },
    ],
  },

  [ActionType.DefenseSlash]: {
    name: "防御斩",
    description: "快速挥刀后立刻进行防御，不给敌人任何可乘之机",
    rarity: Rarity.Rare,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 进行了一次快速攻击`,
      },
      {
        category: ActionCategory.Defend,
        coeff: { str: 1.5, int: 0, con: 1.5, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 进行了铁壁一般的防御`,
      },
    ],
  },

  [ActionType.Dodge]: {
    name: "闪避",
    description: "天下武功，唯快不破。若是能闪过敌人的攻击，将使敌人失衡，失去下一个动作",
    rarity: Rarity.Common,
    hits: [
      {
        category: ActionCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: -1.5, app: 0, dex: 3 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 进行了躲闪`,
      },
    ],
  },

  [ActionType.SpinAttack]: {
    name: "回旋斩",
    description: "闪避后趁敌人重心不稳发起攻击",
    rarity: Rarity.Rare,
    hits: [
      {
        category: ActionCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: -1.5, app: 0, dex: 2.5 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 进行了躲闪`,
      },
      {
        category: ActionCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 进行了回旋斩`,
      },
    ],
  },

  [ActionType.DragonBreath]: {
    name: "巨龙吐息",
    description: "据说巨龙的吐息足以融化钢铁",
    rarity: Rarity.Unique,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 0, int: 10, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 喷出了汹涌的火焰`,
      },
      {
        category: ActionCategory.Attack,
        coeff: { str: 0, int: 5, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 喷出了灼热的火焰`,
      },
      {
        category: ActionCategory.Attack,
        coeff: { str: 0, int: 2, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 喷出了喉咙中残余的火焰`,
      },
    ],
  },

  [ActionType.GodStrike]: {
    name: "神击",
    description: "犹如神灵降下天罚",
    rarity: Rarity.Unique,
    hits: [
      {
        category: ActionCategory.Attack,
        coeff: { str: 12, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, target: Creature) => `神明的愤怒降临于${target.name}`,
      },
    ],
  },

  [ActionType.ShredFlower]: {
    name: "碎花",
    description: "无人能看清动作，空中轻柔的落花瞬间化为齑粉",
    rarity: Rarity.Unique,
    hits: [
      {
        category: ActionCategory.Defend,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 6 },
        messageGenerator: (_actor: Creature, target: Creature) => `${target.name} 被花瓣包围了`,
      },
      {
        category: ActionCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 6 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 的身影消失了`,
      },
      {
        category: ActionCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 4 },
        messageGenerator: (_actor: Creature, _target: Creature) => `只有残影`,
      },
      {
        category: ActionCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 4 },
        messageGenerator: (_actor: Creature, _target: Creature) => `更多的残影`,
      },
      {
        category: ActionCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 3 },
        messageGenerator: (_actor: Creature, target: Creature) => `${target.name} 同花瓣一同破碎`,
      },
    ],
  },
}
