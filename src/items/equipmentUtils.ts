import { EquipmentPrefix } from "./types";
import { equipmentConfigs, EquipmentType } from "./equipmentConfigs";
import { Equipment } from "./Equipment";
import type { Rarity } from "../types";

// 生成随机前缀
export function generateRandomPrefix() {
  return Object.values(EquipmentPrefix)[
    Math.floor(Math.random() * Object.values(EquipmentPrefix).length)
  ];
}

// 根据稀有度随机抽取装备类型
export function generateRandomEquipment(rarity: Rarity): Equipment {
  // 筛选出稀有度为rarity的装备类型
  const equipmentKeys = Object.keys(equipmentConfigs).filter(
    (key) => equipmentConfigs[key as EquipmentType].rarity === rarity,
  );
  const randomIndex = Math.floor(Math.random() * equipmentKeys.length);
  const randomEquipmentKey = equipmentKeys[randomIndex];
  return new Equipment(randomEquipmentKey as EquipmentType);
}
