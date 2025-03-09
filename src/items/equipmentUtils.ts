import { EquipmentPrefix, Rarity, ItemIdentifier, ItemType } from "./types";
import { commonEquipmentConfigs, rareEquipmentConfigs } from "./equipmentConfigs";
import { v4 as uuidv4 } from 'uuid';

// 生成随机前缀
export function generateRandomPrefix() {
  return Object.values(EquipmentPrefix)[Math.floor(Math.random() * Object.values(EquipmentPrefix).length)];
}

// 根据稀有度随机抽取装备类型
export function generateRandomEquipment(rarity: Rarity) : ItemIdentifier {
  const equipmentConfigs = rarity === Rarity.Common ? commonEquipmentConfigs : rareEquipmentConfigs;
  const equipmentKeys = Object.keys(equipmentConfigs);
  const randomIndex = Math.floor(Math.random() * equipmentKeys.length);
  const randomEquipmentKey = equipmentKeys[randomIndex];
  return {
    type: {
      category: "equipment",
      rarity: rarity,
      key: randomEquipmentKey,
    },
    prefix: generateRandomPrefix(),
    id: uuidv4(),
  };
}

export function generateEquipment(type: ItemType) {
  return {id: uuidv4(), type: type, prefix: generateRandomPrefix()};
}
