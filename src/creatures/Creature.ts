import { creatureConfigs, CreatureType } from "./creatureConfigs";
import type { Coefficient, Ability, CreatureStatus } from "./types";
import type { Item } from "../items/Item";
import type { WeightedActionType } from "../actions/types";
import { actionConfigs, ActionType } from "../actions/actionConfigs";
import type { Action } from "../actions/Action";

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
  // equipments: Equipment[];
  actions: WeightedActionType[];

  constructor(name: string, type: CreatureType, level: number, individualStrength: number) {
    this.name = name;
    this.type = type;
    this.level = level;
    this.individualStrength = individualStrength;
    const coeffs = creatureConfigs[this.type].abilityCoeff;
    const calculateAbility = (coeff: Coefficient, level: number, individualStrength: number) => {
      const randomNumber = Math.random() ** 0.5;
      return coeff.base + coeff.growth * level * individualStrength * randomNumber;
    }

    this.ability = {
      str: calculateAbility(coeffs.str, level, individualStrength),
      int: calculateAbility(coeffs.int, level, individualStrength),
      con: calculateAbility(coeffs.con, level, individualStrength),
      siz: calculateAbility(coeffs.siz, level, individualStrength),
      app: calculateAbility(coeffs.app, level, individualStrength),
      dex: calculateAbility(coeffs.dex, level, individualStrength),
      armor: calculateAbility(coeffs.armor, level, individualStrength),
    }

    this.health = this.ability.con * 10 + this.ability.siz * 5;
    this.maxHealth = this.health;
    this.actions = creatureConfigs[this.type].actions;

  }
  // 按照权重随机返回一个动作
  getRandomAction(): Action {
    const random = Math.random();
    const totalWeight = this.actions.reduce((sum, wa) => sum + wa.weight, 0);
    let cumulativeWeight = 0;
    for (const wa of this.actions) {
      cumulativeWeight += wa.weight;
      if (random < cumulativeWeight / totalWeight) {
        return actionConfigs[wa.actionType];
      }
    }
    return actionConfigs[ActionType.Dazed];
  }

  // getAbility(ability: keyof CreatureAbility): number {
}

