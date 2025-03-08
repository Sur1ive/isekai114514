import { Action } from "./Action";
import { actionConfigs } from "./actions";
import { creatureConfigs } from "../creatures/CreatureType";

export type ActionKey = keyof typeof actionConfigs;

export interface WeightedActionKey {
  actionKey: ActionKey;
  weight: number;
}

export function getAction(key: ActionKey) {
  return actionConfigs[key];
}
