import type { Creature } from "../creatures/Creature";
import { HitCategory, ActionCoeff } from "./types";
import type { Rarity } from "../types";

export interface Hit {
  category: HitCategory;
  coeff: ActionCoeff; // 属性系数
  continuous?: boolean; // 是否连续。如果是连续hit，未命中会导致后续hit无法释放
  extraEffect?: (actor: Creature, target: Creature) => void; // 额外效果
  messageGenerator: (actor: Creature, target: Creature) => string;
}

export interface Action {
  name: string;
  description: string;
  rarity: Rarity;
  hits: Hit[];
}
