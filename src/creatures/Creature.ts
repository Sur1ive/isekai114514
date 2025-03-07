import { CreatureType, typeAbilityConfigs } from "./CreatureType";
import { Coefficient } from "./baseTypes";

export interface AbilityCoefficient {
  str: Coefficient;
  int: Coefficient;
  con: Coefficient;
  siz: Coefficient;
  app: Coefficient;
  dex: Coefficient;
}

export interface creatureAbility {
  str: number;
  int: number;
  con: number;
  siz: number;
  app: number;
  dex: number;
  }

export class Creature {
  name: string;
  type: CreatureType;
  level: number;
  individualStrength: number;
  ability: creatureAbility;

  constructor(name: string, type: CreatureType, level: number, individualStrength: number) {
    this.name = name;
    this.type = type;
    this.level = level;
    this.individualStrength = individualStrength;

    const coeffs = typeAbilityConfigs[type];
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
    }

  }
}





