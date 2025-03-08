import { CreatureStatus } from "./CreatureStatus";
import { creatureConfigs, CreatureType } from "./CreatureType";
import { Coefficient } from "./baseTypes";
import { ItemIdentifier } from "../items/items";
import { WeightedActionKey } from "../actions/ActionList";
import { getAction } from "../actions/ActionList";
import { Action } from "../actions/Action";

export interface AbilityCoefficient {
  str: Coefficient;
  int: Coefficient;
  con: Coefficient;
  siz: Coefficient;
  app: Coefficient;
  dex: Coefficient;
  armor: Coefficient;
}

export interface Ability {
  str: number;
  int: number;
  con: number;
  siz: number;
  app: number;
  dex: number;
  armor: number;
  }

export class Creature {
  name: string;
  type: CreatureType;
  level: number;
  individualStrength: number;
  health: number;
  ability: Ability;
  status: CreatureStatus[];
  pack: ItemIdentifier[];
  // equipments: Equipment[];
  actions: WeightedActionKey[];

  constructor(name: string, type: CreatureType, level: number, individualStrength: number) {
    this.name = name;
    this.type = type;
    this.level = level;
    this.individualStrength = individualStrength;
    this.pack = [];
    const coeffs = creatureConfigs[type].abilityCoeff;
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

    this.status = [];

    this.health = this.ability.con * 10 + this.ability.siz * 5;
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

