import { ConsumableType } from "../items/consumableConfigs";
import type { CreatureData } from "./types";
import { ActionType } from "../actions/actionConfigs";
import { EquipmentType } from "../items/equipmentConfigs";
import { StatusType } from "./status/statusConfigs";
import dragon1 from "@/assets/dragon1.gif";
import dragon2 from "@/assets/dragon2.gif";
import dragon3 from "@/assets/dragon3.jpg";

export enum CreatureType {
  Player = "Player",
  Player114514 = "Player114514",
  FullPowerPlayer114514 = "FullPowerPlayer114514",
  Slime = "Slime",
  Dragon = "Dragon",
  AngryDragon = "AngryDragon",
  WeakDragon = "WeakDragon",
  Wolf = "Wolf",
  DiscardedGolem = "DiscardedGolem",
  Ayulsa = "Ayulsa",
  Toono = "Toono",
  Horse = "Horse",
  Goblin = "Goblin",
  FrightenedGoblinLeader = "FrightenedGoblinLeader",
  AngryGoblinLeader = "AngryGoblinLeader",
  TreasureSlime = "TreasureSlime",
}

export const creatureConfigs: Record<CreatureType, CreatureData> = {
  [CreatureType.Player]: {
    typeName: "人类",
    description: "你",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 5, growth: 0.1 },
      con: { base: 5, growth: 0.2 },
      siz: { base: 5, growth: 0 },
      app: { base: 5, growth: 0 },
      dex: { base: 5, growth: 0.1 },
      armor: { base: 0, growth: 0 },
      piercing: { base: 0, growth: 0 },
    },
    actions: [
      { actionType: ActionType.Attack, weight: 0.5 },
      { actionType: ActionType.Capture, weight: 0.1 },
      { actionType: ActionType.Defend, weight: 0.2 },
      { actionType: ActionType.Dodge, weight: 0.2 },
    ],
    dropItems: [],
  },
  [CreatureType.Player114514]: {
    typeName: "野兽仙贝",
    description: "24岁，是学生",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 5, growth: 0.1 },
      con: { base: 5, growth: 0.2 },
      siz: { base: 5, growth: 0 },
      app: { base: 5, growth: 0 },
      dex: { base: 5, growth: 0.1 },
      armor: { base: 0, growth: 0 },
      piercing: { base: 0, growth: 0 },
    },
    actions: [
      { actionType: ActionType.Attack, weight: 0.5 },
      { actionType: ActionType.Capture, weight: 0.1 },
      { actionType: ActionType.Defend, weight: 0.2 },
      { actionType: ActionType.Dodge, weight: 0.2 },
      { actionType: ActionType.PowerfulDigAttack, weight: 0.03 },
      { actionType: ActionType.Yarimasune, weight: 0.03 },
      { actionType: ActionType.Repent, weight: 0.03 },
      { actionType: ActionType.SleepyTea, weight: 0.03 },
    ],
    dropItems: [],
  },
  [CreatureType.FullPowerPlayer114514]: {
    typeName: "野兽仙贝",
    description: "24岁，是学生",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 5, growth: 0.1 },
      con: { base: 5, growth: 0.2 },
      siz: { base: 5, growth: 0 },
      app: { base: 5, growth: 0 },
      dex: { base: 5, growth: 0.1 },
      armor: { base: 0, growth: 0 },
      piercing: { base: 0, growth: 0 },
    },
    actions: [
      { actionType: ActionType.PowerfulDigAttack, weight: 0.3 },
      { actionType: ActionType.Yarimasune, weight: 0.3 },
      { actionType: ActionType.Repent, weight: 0.3 },
      { actionType: ActionType.SleepyTea, weight: 0.3 },
    ],
    dropItems: [],
  },
  [CreatureType.Toono]: {
    typeName: "远野",
    description: "野兽学派的哲学家后辈",
    abilityCoeff: {
      str: { base: 10, growth: 0.1 },
      int: { base: 5, growth: 0.1 },
      con: { base: 10, growth: 0.2 },
      siz: { base: 5, growth: 0 },
      app: { base: 5, growth: 0 },
      dex: { base: 5, growth: 0.1 },
      armor: { base: 0, growth: 5 },
      piercing: { base: 0, growth: 5 },
    },
    actions: [
      { actionType: ActionType.PowerfulDigAttack, weight: 0.4 },
      { actionType: ActionType.Counter, weight: 0.4 },
      { actionType: ActionType.Dodge, weight: 0.2 },
    ],
    dropItems: [{ type: EquipmentType.ToonoDefeaterBadge, weight: 1 }],
  },
  [CreatureType.Slime]: {
    typeName: "史莱姆",
    description: "一种行动缓慢的软体生物，武器打上去没有什么手感",
    abilityCoeff: {
      str: { base: 3, growth: 0.05 },
      int: { base: 0, growth: 0 },
      con: { base: 3, growth: 0.1 },
      siz: { base: 2, growth: 0.05 },
      app: { base: 0, growth: 0 },
      dex: { base: 1, growth: 0.05 },
      armor: { base: 25, growth: 5.5 },
      piercing: { base: 0, growth: 4.5 },
    },
    actions: [
      { actionType: ActionType.Attack, weight: 1 },
      { actionType: ActionType.Defend, weight: 1 },
      { actionType: ActionType.Dazed, weight: 2 },
    ],
    dropItems: [
      { type: null, weight: 0.6 },
      { type: ConsumableType.BrokenChest, weight: 0.4 },
      { type: ConsumableType.WoodenChest, weight: 0.02 },
      { type: ConsumableType.SilverChest, weight: 0.001 },
    ],
  },

  [CreatureType.Dragon]: {
    typeName: "\"池沼之主\"龙",
    image: dragon1,
    description:
      "生态位的顶端，人类在它庞大的身躯面前就像一只蝼蚁。它正用着锐利的目光打量着你，让你不寒而栗。<br>Tips: 你并不需要一次性击败Boss，对其造成20%最大生命值以上的伤害即可永久削减其生命值。你可以通过多次战斗来最终击败它。",
    abilityCoeff: {
      str: { base: 10, growth: 0.2 },
      int: { base: 4, growth: 0.1 },
      con: { base: 20, growth: 0.8 },
      siz: { base: 20, growth: 0.2 },
      app: { base: 4, growth: 0.1 },
      dex: { base: 4, growth: 0.1 },
      armor: { base: 50, growth: 5 },
      piercing: { base: 10, growth: 5 },
    },
    actions: [
      { actionType: ActionType.Bite, weight: 0.1 },
      { actionType: ActionType.PowerAttack, weight: 0.2 },
      { actionType: ActionType.Counter, weight: 0.2 },
      { actionType: ActionType.DragonBreath, weight: 0.2 },
      { actionType: ActionType.QuickAttack, weight: 0.2 },
      { actionType: ActionType.Defend, weight: 0.1 },
    ],
    dropItems: [],
  },

  [CreatureType.AngryDragon]: {
    typeName: "愤怒的龙",
    image: dragon2,
    description:
      "龙彻底被激怒了，一只蝼蚁居然让它受了伤。它有些虚弱，但是攻击更加狂暴了",
    abilityCoeff: {
      str: { base: 15, growth: 0.3 },
      int: { base: 3, growth: 0.05 },
      con: { base: 10, growth: 0.4 },
      siz: { base: 20, growth: 0.2 },
      app: { base: 2, growth: 0.05 },
      dex: { base: 6, growth: 0.15 },
      armor: { base: 25, growth: 5 },
      piercing: { base: 20, growth: 5 },
    },
    actions: [
      { actionType: ActionType.Bite, weight: 0.1 },
      { actionType: ActionType.PowerAttack, weight: 0.2 },
      { actionType: ActionType.DragonBreath, weight: 0.2 },
      { actionType: ActionType.QuickAttack, weight: 0.2 },
    ],
    dropItems: [],
  },

  [CreatureType.WeakDragon]: {
    typeName: "虚弱的龙",
    image: dragon3,
    description: "它抛弃了自己作为龙的尊严，现在一心只想活下去",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 6, growth: 0.15 },
      con: { base: 5, growth: 0.2 },
      siz: { base: 20, growth: 0.2 },
      app: { base: 2, growth: 0.05 },
      dex: { base: 4, growth: 0.1 },
      armor: { base: 20, growth: 5 },
      piercing: { base: 5, growth: 5 },
    },
    actions: [
      { actionType: ActionType.Bite, weight: 0.2 },
      { actionType: ActionType.Counter, weight: 0.3 },
      { actionType: ActionType.DragonBreath, weight: 0.2 },
      { actionType: ActionType.Defend, weight: 0.3 },
    ],
    dropItems: [
      { type: ConsumableType.SilverChest, weight: 0.95 },
      { type: ConsumableType.GoldChest, weight: 0.05 },
      { type: ConsumableType.DiamondChest, weight: 0.002 },
    ],
  },

  [CreatureType.Wolf]: {
    typeName: "孤狼",
    description: "一匹行动敏捷的孤狼，对于普通人来说，它是一种危险的生物",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 2, growth: 0.05 },
      con: { base: 5, growth: 0.15 },
      siz: { base: 4, growth: 0.05 },
      app: { base: 2, growth: 0 },
      dex: { base: 6, growth: 0.15 },
      armor: { base: 0, growth: 5 },
      piercing: { base: 0, growth: 5 },
    },
    actions: [
      { actionType: ActionType.Bite, weight: 1 },
      { actionType: ActionType.QuickAttack, weight: 0.5 },
      { actionType: ActionType.SpinAttack, weight: 0.5 },
    ],
    dropItems: [
      { type: ConsumableType.BrokenChest, weight: 0.8 },
      { type: ConsumableType.WoodenChest, weight: 0.2 },
      { type: ConsumableType.SilverChest, weight: 0.01 },
    ],
  },

  [CreatureType.DiscardedGolem]: {
    typeName: "废弃的岩石魔像",
    description:
      "一尊不知何时被废弃的岩石魔像，在风雨的侵蚀下，它的巨大的身躯上布满了裂痕和苔藓。它不该会动呀？",
    abilityCoeff: {
      str: { base: 15, growth: 0.3 },
      int: { base: 0, growth: 0 },
      con: { base: 10, growth: 0.4 },
      siz: { base: 15, growth: 0.1 },
      app: { base: 0, growth: 0 },
      dex: { base: 0, growth: 0 },
      armor: { base: 75, growth: 5 },
      piercing: { base: 0, growth: 5 },
    },
    actions: [
      { actionType: ActionType.Dazed, weight: 2 },
      { actionType: ActionType.Defend, weight: 1 },
      { actionType: ActionType.PowerAttack, weight: 0.5 },
      { actionType: ActionType.Counter, weight: 0.5 },
    ],
    dropItems: [
      { type: ConsumableType.BrokenChest, weight: 0.2 },
      { type: ConsumableType.WoodenChest, weight: 0.8 },
      { type: ConsumableType.SilverChest, weight: 0.04 },
      { type: ConsumableType.GoldChest, weight: 0.002 },
    ],
  },

  [CreatureType.Ayulsa]: {
    typeName: "???",
    description: "好像并不来自于这个世界",
    abilityCoeff: {
      str: { base: 5, growth: 0.2 },
      int: { base: 50, growth: 0.2 },
      con: { base: 5, growth: 0.4 },
      siz: { base: 5, growth: 0.2 },
      app: { base: 5, growth: 0.2 },
      dex: { base: 5, growth: 0.2 },
      armor: { base: 0, growth: 5 },
      piercing: { base: 0, growth: 5 },
    },
    actions: [
      { actionType: ActionType.GodStrike, weight: 1 },
      { actionType: ActionType.ShredFlower, weight: 1 },
      { actionType: ActionType.PsyKick, weight: 1 },
      { actionType: ActionType.PsyExplosion, weight: 1 },
      { actionType: ActionType.PsyInvisibleSword, weight: 1 },
      { actionType: ActionType.PsyDodge, weight: 1 },
    ],
    dropItems: [{ type: ConsumableType.DiamondChest, weight: 1 }],
  },

  [CreatureType.Horse]: {
    typeName: "马 (?)",
    description: "看起来好像不是普通的马",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 5, growth: 0 },
      con: { base: 7.5, growth: 0.3 },
      siz: { base: 5, growth: 0 },
      app: { base: 5, growth: 0 },
      dex: { base: 10, growth: 0.2 },
      armor: { base: 0, growth: 4.5 },
      piercing: { base: 0, growth: 5.5 },
    },
    actions: [
      { actionType: ActionType.SneakAttack, weight: 1 },
      { actionType: ActionType.LightningFiveStrikes, weight: 1 },
    ],
    dropItems: [
      { type: ConsumableType.BrokenChest, weight: 0.2 },
      { type: ConsumableType.WoodenChest, weight: 0.8 },
      { type: ConsumableType.SilverChest, weight: 0.04 },
      { type: ConsumableType.GoldChest, weight: 0.002 },
    ],
  },

  [CreatureType.Goblin]: {
    typeName: "哥布林",
    description: "绿色皮肤，弱小的群居种族，以偷窃和抢劫为生",
    abilityCoeff: {
      str: { base: 3, growth: 0.1 },
      int: { base: 3, growth: 0 },
      con: { base: 3, growth: 0.1 },
      siz: { base: 3, growth: 0.05 },
      app: { base: 1, growth: 0 },
      dex: { base: 5, growth: 0.1 },
      armor: { base: 0, growth: 5 },
      piercing: { base: 0, growth: 5 },
    },
    actions: [
      { actionType: ActionType.SneakAttack, weight: 1 },
      { actionType: ActionType.Dazed, weight: 1 },
      { actionType: ActionType.RunAway, weight: 1 },
    ],
    dropItems: [
      { type: null, weight: 0.6 },
      { type: ConsumableType.BrokenChest, weight: 0.4 },
      { type: ConsumableType.WoodenChest, weight: 0.02 },
      { type: ConsumableType.SilverChest, weight: 0.001 },
    ],
  },

  [CreatureType.FrightenedGoblinLeader]: {
    typeName: "受到惊吓的哥布林首领",
    description: "这只哥布林比普通人类还要大上一圈，且穿着皮甲拿着刀，身上挂着很多装饰品。很显然，它就是这里的首领。它看起来被后方出现的你吓了一大跳<p>Tips: 你并不需要一次性击败Boss，对其造成20%最大生命值以上的伤害即可永久削减其生命值。你可以通过多次战斗来最终击败它。</p>",
    abilityCoeff: {
      str: { base: 2, growth: 0.1 },
      int: { base: 4, growth: 0 },
      con: { base: 5, growth: 0.2 },
      siz: { base: 6, growth: 0.05 },
      app: { base: 3, growth: 0 },
      dex: { base: 2.5, growth: 0.05 },
      armor: { base: 0, growth: 5 },
      piercing: { base: 0, growth: 5 },
    },
    actions: [
      { actionType: ActionType.Defend, weight: 1 },
      { actionType: ActionType.Dazed, weight: 1 },
      { actionType: ActionType.Counter, weight: 0.5 },
      { actionType: ActionType.DefenseSlash, weight: 0.5 },
    ],
    dropItems: [],
  },

  [CreatureType.AngryGoblinLeader]: {
    typeName: "暴怒的哥布林首领",
    description: "哥布林们的首领愤怒了，它难听地吼叫着，挥舞着武器向你冲来<p>Tips: 你并不需要一次性击败Boss，对其造成20%最大生命值以上的伤害即可永久削减其生命值。你可以通过多次战斗来最终击败它。</p>",
    abilityCoeff: {
      str: { base: 5, growth: 0.1 },
      int: { base: 4, growth: 0 },
      con: { base: 5, growth: 0.2 },
      siz: { base: 5, growth: 0.05 },
      app: { base: 3, growth: 0 },
      dex: { base: 5, growth: 0.1 },
      armor: { base: 10, growth: 5 },
      piercing: { base: 0, growth: 5 },
    },
    actions: [
      { actionType: ActionType.PowerAttack, weight: 1 },
      { actionType: ActionType.Bite, weight: 1 },
      { actionType: ActionType.SneakAttack, weight: 1 },
      { actionType: ActionType.Defend, weight: 1 },
      { actionType: ActionType.Slash, weight: 1 },
      { actionType: ActionType.Dodge, weight: 1 },
    ],
    dropItems: [
      { type: ConsumableType.BrokenChest, weight: 0.4 },
      { type: ConsumableType.WoodenChest, weight: 0.6 },
      { type: ConsumableType.SilverChest, weight: 0.02 },
      { type: ConsumableType.GoldChest, weight: 0.001 },
    ],
  },

  [CreatureType.TreasureSlime]: {
    typeName: "宝箱史莱姆",
    description: "那边的史莱姆肚子里怎么有个闪闪发光的宝箱？等等别跑！谁家史莱姆跑这么快！？",
    abilityCoeff: {
      str: { base: 3, growth: 0.05 },
      int: { base: 0, growth: 0 },
      con: { base: 3, growth: 0.1 },
      siz: { base: 2, growth: 0.05 },
      app: { base: 0, growth: 0 },
      dex: { base: 5, growth: 0.2 },
      armor: { base: 25, growth: 5.5 },
      piercing: { base: 0, growth: 4.5 },
    },
    actions: [
      { actionType: ActionType.Dodge, weight: 1 },
      { actionType: ActionType.RunAway, weight: 1 },
      { actionType: ActionType.Dazed, weight: 1 },
    ],
    dropItems: [
      { type: ConsumableType.SlimeChest, weight: 1 },
    ],
    initStatus: [{ type: StatusType.WillEscape, duration: 10 }],
  },
};
