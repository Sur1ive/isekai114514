import type { Action, Hit } from "./Action";
import type { Creature } from "../creatures/Creature";
import { StatusType } from "../creatures/status/statusConfigs";
import { HitCategory } from "./types";
import { Rarity } from "../types";
import { capture } from "./actionUtils";

export enum ActionType {
  Dazed = "Dazed",
  Attack = "Attack",
  PowerAttack = "PowerAttack",
  QuickAttack = "QuickAttack",
  PowerfulDigAttack = "PowerfulDigAttack",
  Yarimasune = "Yarimasune",
  SleepyTea = "SleepyTea",
  Repent = "Repent",
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
  PsyKick = "PsyKick",
  PsyExplosion = "PsyExplosion",
  PsyInvisibleSword = "PsyInvisibleSword",
  PsyDodge = "PsyDodge",
  Slash = "Slash",
  Claw = "Claw",
  HelmBreaker = "HelmBreaker",
  StepSlash = "StepSlash",
  Mikiri = "Mikiri",
  SpiritRoundSlash = "SpiritRoundSlash",
  NeverRetreat = "NeverRetreat",
  LightningStormSlash = "LightningStormSlash",
  LightningFiveStrikes = "LightningFiveStrikes",
  CrowFly = "CrowFly",
  ParkDestroyer = "ParkDestroyer",
  SneakAttack = "SneakAttack",
  RunAway = "RunAway",
}

export const NoHit: Hit = {
  category: HitCategory.None,
  coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
  messageGenerator: (actor: Creature, _target: Creature) =>
    `${actor.name} 来不及反应`,
};

// common的系数大致是2，rare的系数大致是3.5，Masterpiece的系数大致是5+，
// Epic的系数大致是10(小权重)，mythical随便设计10+系数，但是小权重
export const actionConfigs: Record<ActionType, Action> = {
  [ActionType.Dazed]: {
    name: "反应不过来",
    description: "来不及反应",
    rarity: Rarity.Common,
    hits: [
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 来不及反应`,
      },
    ],
  },

  [ActionType.Stun]: {
    name: "眩晕",
    description: "眩晕",
    rarity: Rarity.Common,
    hits: [
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 眩晕了`,
      },
    ],
  },

  [ActionType.Attack]: {
    name: "攻击",
    description: "用拳头或者用武器进行一般通过攻击",
    rarity: Rarity.Common,
    hits: [
      {
        category: HitCategory.Attack,
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
        category: HitCategory.Attack,
        coeff: { str: 2, int: 0, con: 0, siz: 1, app: 0, dex: 0.5 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}对${target.name}发起了一次强力的攻击`;
        },
      },
    ],
  },
  [ActionType.QuickAttack]: {
    name: "迅击",
    description:
      "据说剑圣在一个呼吸间就能劈出数刀。虽然你不是剑圣，但你努努力也至少能劈出两刀",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}以迅雷不及掩耳之势向${target.name}发起了攻势`;
        },
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `电光火石之间，${actor.name}再次做出了攻击`;
        },
      },
    ],
  },

  [ActionType.PowerfulDigAttack]: {
    name: "撅",
    description: "撅是对知识的渴求。古往今来多少哲学家撅地三尺探求真理",
    rarity: Rarity.Masterpiece,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 2, int: 0, con: 0, siz: 3, app: 0, dex: 0 },
        extraEffect: (_actor: Creature, target: Creature) => {
          target.addStatus(StatusType.Pain, 1);
        },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}撅了${target.name}，${target.name}痛苦难耐\n// 哼哼啊啊啊啊啊啊啊啊啊啊 `;
        },
      },
    ],
  },

  [ActionType.SleepyTea]: {
    name: "饮用昏睡红茶",
    description: "诗人都喜欢饮酒作赋，古代的哲学家也是如此，只是彼时还没有酒",
    rarity: Rarity.Epic,
    hits: [
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `${actor.name}喝下了昏睡红茶，进入睡眠`;
        },
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `${actor.name}喝下了昏睡红茶，于睡眠中恢复了<span style="color: green">${actor.getAbility().con}</span>点生命值`;
        },
        extraEffect: (actor: Creature, _target: Creature) => {
          actor.recoverHp(actor.getAbility().con / 2);
        },
      },
    ],
  },

  [ActionType.Yarimasune]: {
    name: "这个可以有！(赞赏)",
    description: "丝毫不吝啬对敌人的赞赏，这就是野兽先辈的气量",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.Defend,
        coeff: { str: 0.5, int: 0, con: 1, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了防御`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了反击`,
      },
    ],
  },

  [ActionType.Repent]: {
    name: "†你改悔罢†",
    description: "令敌人改悔的神圣攻击",
    rarity: Rarity.Masterpiece,
    hits: [
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: -1.5, app: 0, dex: 2.5 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了闪躲`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 2, int: 0, con: 0, siz: 0, app: 0, dex: 2 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name}曰: †你改悔罢†`,
      },
    ],
  },

  [ActionType.HorizontalSlash]: {
    name: "横斩",
    description: "千钧之力的大力横劈",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 3, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `${actor.name}猛劈一刀`;
        },
      },
    ],
  },

  [ActionType.StepSlash]: {
    name: "踏前斩",
    description: "前踏一步进行追击，而后猛劈一刀",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `${actor.name}前踏一步`;
        },
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 3, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `${actor.name}借着前冲的力劈出强力一击`;
        },
      },
    ],
  },

  [ActionType.Mikiri]: {
    name: "见切",
    description: "在敌人攻击的瞬间拔刀后退，成功回避攻击则能乘势将气入刀，以在下回合释放气刃大回旋",
    rarity: Rarity.Masterpiece,
    hits: [
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 4 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name}在敌人攻击的瞬间拔刀后退`,
        extraEffect: (actor: Creature, _target: Creature) => {
          actor.addStatus(StatusType.SpiritBlade, 1);
        },
      },
    ],
  },

  [ActionType.SpiritRoundSlash]: {
    name: "气刃大回旋",
    description: "将气附于刀刃之上，使出极大幅度回转刀身的斩击，若是击中敌人则可使用登龙",
    rarity: Rarity.Masterpiece,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 4, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `${actor.name}使出极大幅度回转刀身的斩击`;
        },
        extraEffect: (actor: Creature, _target: Creature) => {
          actor.addStatus(StatusType.RedBlade, 1);
        },
      },
    ],
  },

  [ActionType.HelmBreaker]: {
    name: "登龙",
    description: "快速向前突进，若成功击中命中便会借势踩着敌人的身体一路跃至高空，而后以全身的力量从空中向下劈出泣鬼神的一刀",
    rarity: Rarity.Mythical,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        continuous: true,
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}向${target.name}突进，踩着${target.name}的身体一路跃至高空`;
        },
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 10, int: 0, con: 2, siz: 2, app: 0, dex: 2 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}从天而降，以全身之力劈向${target.name}`;
        },
      },
    ],
  },

  // 劈砍
  [ActionType.Slash]: {
    name: "劈砍",
    description: "挥舞手中的武器",
    rarity: Rarity.Common,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 2, int: 0, con: 0, siz: 0, app: 0, dex: 0.5 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}挥舞手中的武器劈向${target.name}`;
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
        category: HitCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0.5, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}冲过来咬了${target.name}一口`;
        },
      },
    ],
  },

  [ActionType.Claw]: {
    name: "爪击",
    description: "野兽的原始攻击方式",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0.5, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}向${target.name}挥舞锐利的爪子`;
        },
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0.5, app: 0, dex: 0},
        messageGenerator: (actor: Creature, target: Creature) => {
          return `${actor.name}向${target.name}挥舞锐利的爪子`;
        },
      },
    ],
  },

  // 抱头鼠窜
  [ActionType.RunAway]: {
    name: "抱头鼠窜",
    description: "抱头鼠窜",
    rarity: Rarity.Common,
    hits: [
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `${actor.name}抱头鼠窜`;
        },
      },
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => {
          return `${actor.name}抱头鼠窜`;
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
        category: HitCategory.Capture,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 0.5 },
        extraEffect: capture,
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
        category: HitCategory.Defend,
        coeff: { str: 1, int: 0, con: 1, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了防御`,
      },
    ],
  },

  [ActionType.Counter]: {
    name: "反击",
    description: "格挡后乘势反击",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.Defend,
        coeff: { str: 0.5, int: 0, con: 1, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了防御`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了反击`,
      },
    ],
  },

  [ActionType.DefenseSlash]: {
    name: "防御斩",
    description: "快速挥刀后立刻进行防御，不给敌人任何可乘之机",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了一次快速攻击`,
      },
      {
        category: HitCategory.Defend,
        coeff: { str: 1.5, int: 0, con: 1.5, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了铁壁一般的防御`,
      },
    ],
  },

  [ActionType.Dodge]: {
    name: "闪避",
    description:
      "天下武功，唯快不破。若是能闪过敌人的攻击，将使敌人失衡，失去下一个动作",
    rarity: Rarity.Common,
    hits: [
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: -1.5, app: 0, dex: 3 },
        messageGenerator: (actor: Creature, target: Creature) =>
          `${actor.name} 对 ${target.name} 的攻击进行了闪躲`,
      },
    ],
  },

  [ActionType.PsyDodge]: {
    name: "瞬移",
    description: "念力的一种用法",
    rarity: Rarity.Epic,
    hits: [
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, _target: Creature) => `一切如常`,
      },
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 12, con: 0, siz: 0, app: 0, dex: 3 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 的身影瞬间到了别处`,
      },
    ],
  },

  [ActionType.SpinAttack]: {
    name: "回旋击",
    description: "闪避后趁敌人重心不稳发起攻击",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: -1.5, app: 0, dex: 2.5 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了闪避`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0, app: 0, dex: 1.5 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 进行了回旋击`,
      },
    ],
  },

  [ActionType.DragonBreath]: {
    name: "巨龙吐息",
    description: "据说巨龙的吐息足以融化钢铁",
    rarity: Rarity.Epic,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 10, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 喷出了汹涌的火焰`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 5, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 喷出了灼热的火焰`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 2, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 喷出了喉咙中残余的火焰`,
      },
    ],
  },

  [ActionType.GodStrike]: {
    name: "神击",
    description: "犹如神灵降下天罚",
    rarity: Rarity.Mythical,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 12, int: 6, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, target: Creature) =>
          `神明的愤怒降临于${target.name}`,
      },
    ],
  },

  [ActionType.ShredFlower]: {
    name: "碎花",
    description: "无人能看清动作，空中轻柔的落花瞬间化为齑粉",
    rarity: Rarity.Unique,
    hits: [
      {
        category: HitCategory.Defend,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 6 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 被花瓣包围了`,
      },
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 6 },
        messageGenerator: (actor: Creature, _target: Creature) =>
          `${actor.name} 的身影消失了`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 4 },
        messageGenerator: (_actor: Creature, _target: Creature) =>
          `空气中只有残影`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 4 },
        messageGenerator: (_actor: Creature, _target: Creature) =>
          `空气中只有更多的残影`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 3 },
        messageGenerator: (_actor: Creature, target: Creature) =>
          `${target.name} 同花瓣一同破碎`,
      },
    ],
  },

  [ActionType.PsyKick]: {
    name: "念动力踢击",
    description: "通过念力完成的隔空踢击，力道十足又难以防备",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, _target: Creature) => `一切如常`,
      },
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, _target: Creature) => `一切如常`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 1, int: 6, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, target: Creature) =>
          `${target.name}凭空被踢了一脚`,
      },
    ],
  },

  [ActionType.PsyExplosion]: {
    name: "不可视爆裂",
    description: "不可视的念力凝聚成万吨重锤从天而降",
    rarity: Rarity.Epic,
    hits: [
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, _target: Creature) => `一切如常`,
      },
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, _target: Creature) => `一切如常`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 2, int: 12, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, target: Creature) =>
          `${target.name}所在的位置发生了大爆炸`,
      },
    ],
  },

  [ActionType.PsyInvisibleSword]: {
    name: '"不可视之剑"',
    description: "无数看不见的剑刺向敌人，流淌的血勾勒出它们的形状",
    rarity: Rarity.Unique,
    hits: [
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, _target: Creature) => `一切如常`,
      },
      {
        category: HitCategory.None,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, _target: Creature) => `一切如常`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 1.5, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, target: Creature) =>
          `看不见的剑贯穿${target.name}`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 3, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, target: Creature) =>
          `更多看不见的剑贯穿${target.name}`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 6, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, target: Creature) =>
          `极多看不见的剑贯穿${target.name}`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 12, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, target: Creature) =>
          `无数看不见的剑贯穿${target.name}`,
      },
    ],
  },

  [ActionType.NeverRetreat]: {
    name: "死守不退",
    description: "全力防御，死守不退",
    rarity: Rarity.Masterpiece,
    hits: [
      {
        category: HitCategory.Defend,
        coeff: { str: 2, int: 0, con: 2, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 全力防御`,
      },
      {
        category: HitCategory.Defend,
        coeff: { str: 1, int: 0, con: 1, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 死守不退`,
      }
    ],
  },

  [ActionType.CrowFly]: {
    name: "乌鸦坐飞机",
    description: "高高跃起后发起攻击",
    rarity: Rarity.Masterpiece,
    hits: [
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 3 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 一个大跳`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 2, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (actor: Creature, target: Creature) => `${actor.name} 从空中一拳打向 ${target.name}`,
      },
    ]
  },

  [ActionType.ParkDestroyer]: {
    name: "龙卷风击毁停车场",
    description: "释放武器中的狂风之力，形成狂暴的龙卷风",
    rarity: Rarity.Masterpiece,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 0.5 },
        messageGenerator: (_actor: Creature, target: Creature) => `风卷着尘土袭向 ${target.name}`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (_actor: Creature, _target: Creature) => `回旋的风聚成龙卷`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 1.5, int: 0, con: 0, siz: 0, app: 0, dex: 1.5 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 从龙卷风中刺出`,
      },
    ]
  },

  [ActionType.LightningStormSlash]: {
    name: "闪电旋风劈",
    description: "闪！电！旋！风！劈！",
    rarity: Rarity.Masterpiece,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (_actor: Creature, _target: Creature) => `闪电！`,
      },
      {
        category: HitCategory.Dodge,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 2 },
        messageGenerator: (_actor: Creature, _target: Creature) => `旋风！`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 1, int: 0, con: 0, siz: 0, app: 0, dex: 0 },
        messageGenerator: (_actor: Creature, _target: Creature) => `劈！`,
      }
    ],
  },

  [ActionType.LightningFiveStrikes]: {
    name: "闪电五连鞭",
    description: "相传武林中有一位马大师，靠着这套五连鞭驰骋江湖，可惜后来被两个年轻人偷袭，从此销声匿迹",
    rarity: Rarity.Masterpiece,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (_actor: Creature, _target: Creature) => `第一鞭！`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (_actor: Creature, _target: Creature) => `第二鞭！`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (_actor: Creature, _target: Creature) => `第三鞭！`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (_actor: Creature, _target: Creature) => `第四鞭！`,
      },
      {
        category: HitCategory.Attack,
        coeff: { str: 0, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (_actor: Creature, _target: Creature) => `第五鞭！`,
      },
    ],
  },

  [ActionType.SneakAttack]: {
    name: "偷袭",
    description: "来！骗！来！偷袭！",
    rarity: Rarity.Rare,
    hits: [
      {
        category: HitCategory.Attack,
        coeff: { str: 0.5, int: 0, con: 0, siz: 0, app: 0, dex: 1 },
        messageGenerator: (actor: Creature, _target: Creature) => `${actor.name} 来！骗！来！偷袭！`,
        extraEffect: (_actor: Creature, target: Creature) => {
          target.addStatus(StatusType.Dizzy, 1);
        }
      },
    ],
  },
};
