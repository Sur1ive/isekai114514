import { Item } from "./Item";
import { HitCategory, type WeightedActionType } from "../actions/types";
import {
  EquipmentPosition,
  EquipmentAbility,
  EquipmentActionCoeff,
  ItemCategory,
} from "./types";
import { equipmentConfigs, EquipmentType } from "./equipmentConfigs";
import { v4 as uuidv4 } from "uuid";
import { generateRandomPrefix } from "./equipmentUtils";
import { Prefix } from "./Prefix";
import { Rarity } from "../types";

export class Equipment extends Item {
  position: EquipmentPosition;
  extraActions: WeightedActionType[];
  level: number;
  ability: EquipmentAbility;
  armorGrowthCoeff: number;
  piercingGrowthCoeff: number;
  actionCoeff: EquipmentActionCoeff;
  prefix: Prefix;

  constructor(type: EquipmentType, level: number = 0) {
    type = type || EquipmentType.Sword;
    const data = equipmentConfigs[type];
    super(
      data.name,
      uuidv4(),
      ItemCategory.Equipment,
      type,
      data.rarity,
      data.description,
    );
    this.level = level;
    this.armorGrowthCoeff = data.armorGrowthCoeff;
    this.piercingGrowthCoeff = data.piercingGrowthCoeff;
    this.position = data.position;
    this.extraActions = data.extraActions;
    this.randomExtraActionsWeight();
    this.ability = data.ability;
    this.actionCoeff = data.actionCoeff;

    if (!this.ability.armor) {
      this.ability.armor = 0;
    }
    if (!this.ability.piercing) {
      this.ability.piercing = 0;
    }
    this.ability.armor += this.armorGrowthCoeff * this.level;
    this.ability.piercing += this.piercingGrowthCoeff * this.level;

    this.prefix = generateRandomPrefix(this.randomPrefixRarity(), data.position);


  }

  // 行动列表权重波动 20%
  randomExtraActionsWeight() {
    this.extraActions.forEach((action) => {
      action.weight = action.weight * (1 + Math.random() * 0.4 - 0.2);
    });
  }

  randomPrefixRarity() {
    let rarity = Rarity.Common;
    for (let i = 0; i < 10; i++) {
      if (Math.random() < 0.05) {
        rarity -= 1;
      } else if (Math.random() > 0.95) {
        rarity += 1;
      }
    }
    if (rarity < Rarity.Common) {
      rarity = Rarity.Common;
    } else if (rarity > Rarity.Mythical) {
      rarity = Rarity.Mythical;
    }
    return rarity;
  }

  // 获取前缀加成后的能力值
  applyPrefix(): void {
    const abilityKeys: (keyof EquipmentAbility)[] = [
      "str",
      "int",
      "con",
      "siz",
      "app",
      "dex",
      "armor",
      "piercing",
    ];
    abilityKeys.forEach((key) => {
      if (this.prefix.ability?.[key]) {
        this.ability[key] = this.ability[key] ? this.ability[key] + this.prefix.ability[key] : this.prefix.ability[key];
      }
    });

    const actionCoeffKeys: (keyof EquipmentActionCoeff)[] = [
      HitCategory.Attack,
      HitCategory.Defend,
      HitCategory.Dodge,
      HitCategory.Capture,
      HitCategory.Special,
      HitCategory.None,
    ];

    actionCoeffKeys.forEach((key) => {
      if (this.prefix.actionCoeff?.[key]) {
        this.actionCoeff[key] = this.actionCoeff[key] ? {
          plus: this.actionCoeff[key].plus + this.prefix.actionCoeff[key].plus,
          multiply: this.actionCoeff[key].multiply * this.prefix.actionCoeff[key].multiply,
        } : this.prefix.actionCoeff[key];
      }
    });

    this.extraActions.push(...this.prefix.extraActions);
  }

  levelup() {
    this.level++;
    this.ability.armor! += this.armorGrowthCoeff;
    this.ability.piercing! += this.piercingGrowthCoeff;
  }

  // testRarityDistribution(trials: number = 100000): void {
  //   // 统计各个稀有度出现的次数（只统计 Common ~ Mythical，因为 Unique 不会出现）
  //   const counts: { [key in Rarity]?: number } = {};
  //   for (let i = Rarity.Common; i <= Rarity.Mythical; i++) {
  //     counts[i] = 0;
  //   }

  //   // 模拟 trials 次随机结果
  //   for (let i = 0; i < trials; i++) {
  //     const rarity = this.randomPrefixRarity();
  //     counts[rarity]! += 1;
  //   }

  //   console.log(`经过 ${trials} 次试验，各个稀有度的分布情况：`);
  //   for (let i = Rarity.Common; i <= Rarity.Mythical; i++) {
  //     const count = counts[i] || 0;
  //     const percentage = ((count / trials) * 100).toFixed(2);
  //     // Rarity[i] 能够反查到枚举的 key（例如 "Common"）
  //     console.log(`${Rarity[i]}: ${count} 次 (${percentage}%)`);
  //   }
  // }
}
