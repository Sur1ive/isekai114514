import type { Creature } from "../creatures/Creature";
import { ActionCategory, ActionResult, ActionCoeff } from "./types";

export interface Action {
  name: string;
  description: string;
  category: ActionCategory;
  coeff: ActionCoeff;   // 属性系数
  extraEffect?: (actor: Creature, target: Creature) => void;  // 额外效果
  messageGenerator: (actor: Creature, target: Creature, result: ActionResult) => string;
  }
