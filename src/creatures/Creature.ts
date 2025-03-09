import { creatureConfigs, CreatureType } from "./creatureConfigs";
import type { Coefficient, Ability, CreatureStatus } from "./types";
import type { ItemIdentifier } from "../items/types";
import type { WeightedActionKey } from "../actions/types";
import { getAction } from "../actions/actionConfigs";
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
  pack: ItemIdentifier[] = [];
  // equipments: Equipment[];
  actions: WeightedActionKey[];

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

  getRandomAction(): Action {
    const random = Math.random();
    const totalWeight = this.actions.reduce((sum, wa) => sum + wa.weight, 0);
    let cumulativeWeight = 0;
    for (const wa of this.actions) {
      cumulativeWeight += wa.weight;
      if (random < cumulativeWeight / totalWeight) {
        return getAction(wa.actionKey);
      }
    }
    return getAction("dazedAction");
  }

  // getAbility(ability: keyof CreatureAbility): number {
}

