import type { Creature } from "../creatures/Creature";
import { ActionCategory, ActionCoeff } from "./types";
import type { Rarity } from "../types";

export interface Hit {
  category: ActionCategory;
  coeff: ActionCoeff; // 属性系数
  extraEffect?: (actor: Creature, target: Creature) => void; // 额外效果
  messageGenerator: (actor: Creature, target: Creature) => string;
}

export interface Action {
  name: string;
  description: string;
  rarity: Rarity;
  hits: Hit[];
}
