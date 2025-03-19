import type { Creature } from "../creatures/Creature";
import { Player } from "../creatures/Player";
import type { Monster } from "../creatures/Monster";
import type { Action } from "./Action";
import { getHitIcon } from "../tools";
import type { Ability } from "../creatures/types";
import { ActionCoeff } from "./types";

export function capture(actor: Creature, target: Creature): void {
  // actor不是玩家，则不进行任何操作
  if (!(actor instanceof Player)) {
    return;
  }
  if (target.health < 1) {
    actor.addLog(`${target.name}已经死了，无法捕获`);
    return;
  }
  // 否则进行两次概率判定
  const dexSuccessRate =
    ((actor.ability.dex / target.ability.dex) *
      (actor.ability.siz / target.ability.siz)) /
    ((10 * target.health) / target.maxHealth);
  const strSuccessRate =
    ((actor.ability.str / target.ability.str) *
      (actor.ability.siz / target.ability.siz)) /
    ((10 * target.health) / target.maxHealth);
  if (Math.random() < strSuccessRate && Math.random() < dexSuccessRate) {
    target.health = 0.9;
    actor.capturedMonster.push(target as Monster);
    actor.addLog(`你成功捕获了${target.name}`);
  } else {
    actor.addLog(`你尝试捕获${target.name}，但是失败了`);
  }
}

export function getHitsDescription(actor: Creature, action: Action): string {
  return action.hits
  .map(
    (hit) =>
      `${getHitIcon(hit)}${hit.continuous ? "🔗" : ""}(${calculateMinPower(hit.coeff, actor.getAbility(), actor.getActionCoeff(hit.category))}~${calculateMaxPower(hit.coeff, actor.getAbility(), actor.getActionCoeff(hit.category))})`,
    )
    .join("<br>");
}

export function calculateMaxPower(coeff: ActionCoeff, ability: Ability, actionCoeff: { plus: number, multiply: number }) {
  return Math.round(
    (coeff.str * ability.str +
      coeff.dex * ability.dex +
      coeff.int * ability.int +
      coeff.con * ability.con +
      coeff.siz * ability.siz +
      coeff.app * ability.app) *
      actionCoeff.multiply +
      actionCoeff.plus,
  );
}

export function calculateMinPower(coeff: ActionCoeff, ability: Ability, actionCoeff: { plus: number, multiply: number }) {
  return Math.round(calculateMaxPower(coeff, ability, actionCoeff) * 0.1);
}

export function calculatePower(coeff: ActionCoeff, ability: Ability, actionCoeff: { plus: number, multiply: number }) {
  return (
    calculateMinPower(coeff, ability, actionCoeff) +
    Math.round(
      (calculateMaxPower(coeff, ability, actionCoeff) - calculateMinPower(coeff, ability, actionCoeff)) *
        Math.random(),
    )
  );
}
