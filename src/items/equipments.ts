import { Item, ItemIdentifier, ItemType, Rarity } from "./items";
import { Ability } from "../creatures/Creature";
import { ActionType } from "../actions/Action";
import { WeightedActionKey } from "../actions/ActionList";
import { v4 as uuidv4 } from 'uuid';

export type EquipmentAbility = Partial<Ability>;

export interface EquipmentActionCoeffValue {
  plus: number;
  multiply: number;
}

export type EquipmentActionCoeff = Partial<Record<ActionType, EquipmentActionCoeffValue>>;

// todo: 给各个前缀添加效果和出率权重
export enum EquipmentPrefix {
  None = "",
  Big = "巨大的",
  Smelly = "野兽先辈的",
}

export enum EquipmentPosition {
  Head = "head",
  Body = "body",
  Hand = "hand",
  Foot = "foot",
}

export class Equipment extends Item {
  position: EquipmentPosition;
  extraActions: WeightedActionKey[];
  ability: EquipmentAbility;
  actionCoeff: EquipmentActionCoeff;
  prefix: EquipmentPrefix;

  constructor(identifier: ItemIdentifier) {
    super(identifier);
    let data: EquipmentData;
    switch (identifier.type.rarity) {
      case Rarity.Common:
        data = commonEquipmentConfigs[identifier.type.key];
        break;
      case Rarity.Rare:
        data = rareEquipmentConfigs[identifier.type.key];
        break;
      default:
        throw new Error("Invalid rarity");
    }
    this.name = identifier.prefix ? identifier.prefix + data.name : data.name;
    this.description = data.description;
    this.position = data.position;
    this.extraActions = data.extraActions;
    this.ability = data.ability;
    this.actionCoeff = data.actionCoeff;
    this.prefix = identifier.prefix || EquipmentPrefix.None;
  }
}

export interface EquipmentData {
  name: string;
  description: string;
  position: EquipmentPosition;
  extraActions: WeightedActionKey[];
  ability: EquipmentAbility;
  actionCoeff: EquipmentActionCoeff;
}

export type EquipmentKey = keyof typeof commonEquipmentConfigs | keyof typeof rareEquipmentConfigs;

export const commonEquipmentConfigs: Record<string, EquipmentData> = {
  "sword": {
    name: "剑",
    description: "一把剑,平平无奇的武器",
    position: EquipmentPosition.Hand,
    extraActions: [],
    ability: {},
    actionCoeff: {
      [ActionType.Attack]: {
        plus: 1,
        multiply: 1,
      },
    },
  },
}

export const rareEquipmentConfigs: Record<string, EquipmentData> = {
  "katana": {
    name: "太刀",
    description: "太好了，有了这个，你就可以做虾头太刀侠了",
    position: EquipmentPosition.Hand,
    extraActions: [{actionKey: "horizontalSlashAction", weight: 1}],
    ability: {
      str: 1,
      dex: -1,
    },
    actionCoeff: {
      [ActionType.Attack]: {
        plus: 2,
        multiply: 1,
      },
      [ActionType.Dodge]: {
        plus: -2,
        multiply: 1,
      },
    },
  },
}

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
