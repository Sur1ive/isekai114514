import { actionConfigs } from "./actions";

export type ActionKey = keyof typeof actionConfigs;

export interface WeightedActionKey {
  actionKey: ActionKey;
  weight: number;
}

export function getAction(key: ActionKey) {
  return actionConfigs[key];
}
