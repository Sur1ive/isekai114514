import { creatureConfigs, CreatureType } from "./creatureConfigs";
import type { Coefficient, Ability, CreatureStatus } from "./types";
import type { Item } from "../items/Item";
import type { WeightedActionType } from "../actions/types";
import { actionConfigs, ActionType } from "../actions/actionConfigs";
import type { Action } from "../actions/Action";
import type { EquipmentBar } from "./types";
import { Equipment } from "../items/Equipment";
import type { EquipmentPosition } from "../items/types";

export class Creature {
  name: string;
  type: CreatureType;
  level: number;
  individualStrength: number;
  maxHealth: number;
  health: number;
  ability: Ability;
  status: CreatureStatus[] = [];
  pack: Item[] = [];
  equipments: EquipmentBar = {
    head: null,
    body: null,
    hand: null,
    foot: null,
    accessory: null,
  };
  actions: WeightedActionType[];

  constructor(
    name: string,
    type: CreatureType,
    level: number,
    individualStrength: number,
  ) {
    this.name = name;
    this.type = type;
    this.level = level;
    this.individualStrength = individualStrength;
    const coeffs = creatureConfigs[this.type].abilityCoeff;
    const calculateAbility = (
      coeff: Coefficient,
      level: number,
      individualStrength: number,
    ) => {
      const randomNumber = Math.random() ** 0.5;
      return (
        coeff.base + coeff.growth * level * individualStrength * randomNumber
      );
    };

    this.ability = {
      str: calculateAbility(coeffs.str, level, individualStrength),
      int: calculateAbility(coeffs.int, level, individualStrength),
      con: calculateAbility(coeffs.con, level, individualStrength),
      siz: calculateAbility(coeffs.siz, level, individualStrength),
      app: calculateAbility(coeffs.app, level, individualStrength),
      dex: calculateAbility(coeffs.dex, level, individualStrength),
      armor: calculateAbility(coeffs.armor, level, individualStrength),
    };

    this.health = this.ability.con * 10 + this.ability.siz * 5;
    this.maxHealth = this.health;
    this.actions = creatureConfigs[this.type].actions;
  }
  // 按照权重随机返回一个动作
  getRandomAction(): Action {
    const random = Math.random();
    const actions = this.getActions();
    const totalWeight = actions.reduce((sum, wa) => sum + wa.weight, 0);
    let cumulativeWeight = 0;
    for (const wa of actions) {
      cumulativeWeight += wa.weight;
      if (random < cumulativeWeight / totalWeight) {
        return actionConfigs[wa.actionType];
      }
    }
    return actionConfigs[ActionType.Dazed];
  }

  wearEquipment(equipment: Equipment): void {
    if (this.equipments[equipment.position]) {
      this.removeEquipment(equipment.position);
    }
    this.equipments[equipment.position] = equipment;
    this.pack.splice(this.pack.indexOf(equipment), 1);
  }

  removeEquipment(position: EquipmentPosition): void {
    if (this.equipments[position]) {
      this.pack.push(this.equipments[position] as Equipment);
      this.equipments[position] = null;
    }
  }

  // 获取装备加成后的能力值
  getAbility(): Ability {
    const ability = { ...this.ability };
    const keys: (keyof Ability)[] = ['str', 'int', 'con', 'siz', 'app', 'dex', 'armor'];
    // 累加装备的基础属性，若不存在则默认 0
    for (const equipment of Object.values(this.equipments)) {
      if (equipment) {
        keys.forEach(key => {
          ability[key] += equipment.ability?.[key] ?? 0;
        });
      }
    }
    // 乘以装备的行动系数，若不存在则默认 1
    for (const equipment of Object.values(this.equipments)) {
      if (equipment) {
        keys.forEach(key => {
          ability[key] *= equipment.actionCoeff?.[key]?.multiply ?? 1;
        });
      }
    }
    return ability;
  }

  // 获取装备加成后的行动列表
  getActions(): WeightedActionType[] {
    const actions = [...this.actions];
    for (const equipment of Object.values(this.equipments)) {
      if (equipment) {
        actions.push(...equipment.extraActions);
      }
    }
    return actions;
  }
}
