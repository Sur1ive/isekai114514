import { Consumable } from "./Consumable";
import { Equipment } from "./Equipment";
import { ItemType } from "./types";
import { ConsumableType } from "./consumableConfigs";
import { EquipmentType } from "./equipmentConfigs";
import { Item } from "./Item";
import { Rarity } from "../types";
import { generateEquipmentTooltipContent } from "./equipmentUtils";

// 按权重随机选择一个道具
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function randomItemType(itemList: { item: ItemType; weight: number; [key: string]: any }[]) {
  const totalWeight = itemList.reduce((sum, item) => sum + item.weight, 0);
  const randomValue = Math.random() * totalWeight;
  let cumulativeWeight = 0;
  for (const item of itemList) {
    cumulativeWeight += item.weight;
    if (randomValue <= cumulativeWeight) {
      return item;
    }
  }
}

export function generateItem(type: ItemType, level: number = 0): Item {
  if (type in ConsumableType) {
    return new Consumable(type as ConsumableType, level);
  } else if (type in EquipmentType) {
    return new Equipment(type as EquipmentType, level);
  } else {
    throw new Error("Invalid item type");
  }
}

/**
 * 根据不同的物品类型生成 tooltip 内容
 */
export function generateItemTooltipContent(item: Item): string {
  // Consumable 只显示基础信息：名称、稀有度、描述
  if (item instanceof Consumable) {
    return `
      <div class="tooltip-base tooltip-header">
        <h5 class="text-${Rarity[item.rarity]}">${item.level ? `lv${item.level}` : ""} ${item.name}</h5>
        <p class="fst-italic">${item.description}</p>
      </div>
    `;
  }

  // Equipment 则显示更多内容
  if (item instanceof Equipment) {
    return generateEquipmentTooltipContent(item);
  }

  // 其他类型则简单显示名称和描述
  return `
    <div class="tooltip-base">
      <h5>${item.name}</h5>
      <p class="fst-italic">"${item.description}"</p>
    </div>
  `;
}
