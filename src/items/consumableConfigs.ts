import type { Creature } from "../creatures/Creature";
import { Rarity } from "../types";
import { ConsumableData } from "./types";
import { openChest, openSpecialChest } from "./consumableUtils";
import { Consumable } from "./Consumable";
import { Equipment } from "./Equipment";
import { EquipmentType } from "./equipmentConfigs";
import { StatusType } from "../creatures/status/statusConfigs";

export enum ConsumableType {
  Unknown = "Unknown",
  BrokenChest = "BrokenChest",
  WoodenChest = "WoodenChest",
  SilverChest = "SilverChest",
  GoldChest = "GoldChest",
  DiamondChest = "DiamondChest",
  QuickRecoveryPotion = "QuickRecoveryPotion",
  LifePotion = "LifePotion",
  LargeLifePotion = "LargeLifePotion",
  GiftboxAndLetter = "GiftboxAndLetter",
  SlimeChest = "SlimeChest",
  EmptySlimeChest = "EmptySlimeChest",
}

export const consumableConfigs: Record<ConsumableType, ConsumableData> = {
  [ConsumableType.BrokenChest]: {
    name: "破烂的木宝箱",
    rarity: Rarity.Common,
    description: "一个破破烂烂的宝箱",
    effect: (target: Creature, level: number) => {
      target.pack.push(openChest(level, Rarity.Common));
    },
  },
  [ConsumableType.WoodenChest]: {
    name: "木质的宝箱",
    rarity: Rarity.Rare,
    description: "一个有着漂亮的木质纹理的宝箱",
    effect: (target: Creature, level: number) => {
      target.pack.push(openChest(level, Rarity.Rare));
    },
  },
  [ConsumableType.SilverChest]: {
    name: "银色装饰的宝箱",
    rarity: Rarity.Masterpiece,
    description: "这个宝箱上有着精细的银制装饰，银锈并不能掩盖它的华丽",
    effect: (target: Creature, level: number) => {
      target.pack.push(openChest(level, Rarity.Masterpiece));
    },
  },
  [ConsumableType.GoldChest]: {
    name: "黄金镶边的宝箱",
    rarity: Rarity.Epic,
    description: "金光闪闪，这才叫宝箱！光是看着就让人心潮澎湃",
    effect: (target: Creature, level: number) => {
      target.pack.push(openChest(level, Rarity.Epic));
    },
  },
  [ConsumableType.DiamondChest]: {
    name: "华丽的宝石宝箱",
    rarity: Rarity.Mythical,
    description: "无法用辞藻形容的华丽，你甚至害怕打开它会划伤上面美丽的宝石",
    effect: (target: Creature, level: number) => {
      target.pack.push(openChest(level, Rarity.Mythical));
    },
  },
  [ConsumableType.SlimeChest]: {
    name: "史莱姆宝箱",
    rarity: Rarity.Epic,
    description: "一个史莱姆形状的宝箱，看起来非常可爱。这是大自然的鬼斧神工吗？",
    effect: (target: Creature, level: number) => {
      target.pack.push(new Consumable(ConsumableType.EmptySlimeChest));
      if (Math.random() < 0.005) {
        target.pack.push(openSpecialChest(level, Rarity.Mythical));
      } else if (Math.random() < 0.05) {
        target.pack.push(openSpecialChest(level, Rarity.Epic));
      } else {
        target.pack.push(openSpecialChest(level, Rarity.Masterpiece));
      }
    },
  },
  [ConsumableType.EmptySlimeChest]: {
    name: "空的史莱姆宝箱",
    rarity: Rarity.Epic,
    description: "不知道有什么用，但是你的直觉告诉你这么稀有的东西还是留着比较好",
    canNotBeUsed: true,
    effect: (_target: Creature, _level: number) => {},
  },
  [ConsumableType.Unknown]: {
    name: "未知",
    rarity: Rarity.Common,
    description: "未知",
    effect: (_target: Creature, _level: number) => {},
  },
  [ConsumableType.QuickRecoveryPotion]: {
    name: "神秘黄色药水",
    rarity: Rarity.Epic,
    description: "看起来不像是这个世界的产物。非常的新鲜，非常的美味<p>自动回复速度提升至5倍，持续3分钟</p>",
    effect: (target: Creature, _level: number) => {
      target.addStatus(StatusType.QuickRecovery, 180, 5);
      console.log("使用快速恢复秘药");
    },
  },
  [ConsumableType.LifePotion]: {
    name: "生命秘药",
    rarity: Rarity.Masterpiece,
    description: "只要没死，区区断胳膊断腿喝下去立马都能长回来。你有个疑问，这玩意儿到底是什么做的？<p>恢复50点生命值</p>",
    effect: (target: Creature, _level: number) => {
      target.recoverHp(50);
    },
  },
  [ConsumableType.LargeLifePotion]: {
    name: "大瓶生命秘药",
    rarity: Rarity.Epic,
    description: "普通的生命秘药一次只能让你长一只胳膊，而这大瓶装能让你一次全长回来。前提是你还有手可以拿它<p>恢复100点生命值</p>",
    effect: (target: Creature, _level: number) => {
      target.recoverHp(100);
    },
  },
  [ConsumableType.GiftboxAndLetter]: {
    name: "礼物箱和一封信",
    rarity: Rarity.Mythical,
    description: "一个礼物箱，上面还附了一封信，信上的字模糊不清",
    effect: (target: Creature, _level: number) => {
      for (let i = 0; i < 5; i++) {
        target.pack.push(new Consumable(ConsumableType.QuickRecoveryPotion));
        target.pack.push(new Consumable(ConsumableType.LifePotion));
        target.pack.push(new Consumable(ConsumableType.LargeLifePotion));
      }
      target.pack.push(new Equipment(EquipmentType.Sword));
      target.pack.push(new Equipment(EquipmentType.Rope));
    },
  },
};
