import { AbilityCoefficient } from "./Creature";

export enum CreatureType {
  Player = 'Player',
  Slime = 'Slime',
  Dragon = 'Dragon',
  }

export const typeAbilityConfigs: Record<CreatureType, AbilityCoefficient> = {
[CreatureType.Player]: {
  str: { base: 10, growth: 1 },
  int: { base: 10, growth: 1 },
  con: { base: 10, growth: 1 },
  siz: { base: 10, growth: 0 },
  app: { base: 10, growth: 0 },
  dex: { base: 10, growth: 1 },
},
[CreatureType.Slime]: {
  str: { base: 1, growth: 1 },
  int: { base: 1, growth: 1 },
  con: { base: 10, growth: 1 },
  siz: { base: 5, growth: 0 },
  app: { base: 1, growth: 0 },
  dex: { base: 1, growth: 1 },
},
[CreatureType.Dragon]: {
  str: { base: 100, growth: 1 },
  int: { base: 10, growth: 1 },
  con: { base: 10, growth: 1 },
  siz: { base: 100, growth: 0 },
  app: { base: 10, growth: 0 },
  dex: { base: 10, growth: 1 },
}
};
