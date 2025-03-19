import { equipmentConfigs, EquipmentType } from "./equipmentConfigs";
import { Equipment } from "./Equipment";
import type { Rarity } from "../types";
import { prefixConfigs, PrefixType } from "./prefixConfigs";
import { EquipmentPosition } from "./types";

// 生成随机前缀
export function generateRandomPrefix(rarity: Rarity, position: EquipmentPosition) {
  const prefixKeys = Object.keys(prefixConfigs).filter(
    (key) => prefixConfigs[key as PrefixType].rarity === rarity && (prefixConfigs[key as PrefixType].position === position || prefixConfigs[key as PrefixType].position === "AnyPosition"),
  );
  const randomIndex = Math.floor(Math.random() * prefixKeys.length);
  const randomPrefixKey = prefixKeys[randomIndex];

  return prefixConfigs[randomPrefixKey as PrefixType] || prefixConfigs[PrefixType.None];
}

// 根据稀有度随机抽取装备类型
export function generateRandomEquipment(rarity: Rarity, level: number): Equipment {
  // 筛选出稀有度为rarity的装备类型
  const equipmentKeys = Object.keys(equipmentConfigs).filter(
    (key) => equipmentConfigs[key as EquipmentType].rarity === rarity,
  );
  const randomIndex = Math.floor(Math.random() * equipmentKeys.length);
  const randomEquipmentKey = equipmentKeys[randomIndex];
  return new Equipment(randomEquipmentKey as EquipmentType, level);
}
