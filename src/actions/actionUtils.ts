import type { Creature } from "../creatures/Creature";
import { Player } from "../creatures/Player";
import type { Monster } from "../creatures/Monster";
import type { Action } from "./Action";
import type { Ability } from "../creatures/types";
import { ActionCoeff } from "./types";
import { HitCategory } from "./types";
import { Hit } from "./Action";
import { showToast } from "../utils/toast";

export function capture(actor: Creature, target: Creature): void {
  // actor不是玩家，则不进行任何操作
  if (!(actor instanceof Player)) {
    return;
  }
  if (target.health < 1) {
    actor.addLog(`${target.name}已经死了，无法捕获`);
    return;
  }

  const actorAbility = actor.getAbility();
  const targetAbility = target.getAbility();

  // 否则进行两次概率判定
  const dexSuccessRate =
    ((actorAbility.dex / targetAbility.dex) *
      (actorAbility.siz / targetAbility.siz)) /
    ((10 * target.health) / target.getMaxHealth());
  const strSuccessRate =
    ((actorAbility.str / targetAbility.str) *
      (actorAbility.siz / targetAbility.siz)) /
    ((10 * target.health) / target.getMaxHealth());
  if (Math.random() < strSuccessRate && Math.random() < dexSuccessRate) {
    target.health = 0.9;
    actor.capturedMonster.push(target as Monster);
    actor.addLog(`你成功捕获了${target.name}`);
    showCaptureToast(target.name);
  } else {
    actor.addLog(`你尝试捕获${target.name}，但是失败了`);
  }
}

function showCaptureToast(monsterName: string): void {
  showToast(
    "🕸️ 捕捉成功",
    `成功捕获了 <strong>${monsterName}</strong>！`,
    { headerClass: "bg-success text-white" },
  );
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
  const power = Math.round(
    (coeff.str * ability.str +
      coeff.dex * ability.dex +
      coeff.int * ability.int +
      coeff.con * ability.con +
      coeff.siz * ability.siz +
      coeff.app * ability.app) *
      actionCoeff.multiply +
      actionCoeff.plus,
  );
  if (power < 0) {
    return 0;
  }
  return power;
}

export function calculateMinPower(coeff: ActionCoeff, ability: Ability, actionCoeff: { plus: number, multiply: number }) {
  const power = Math.round(calculateMaxPower(coeff, ability, actionCoeff) * 0.1);
  if (power < 0) {
    return 0;
  }
  return power;
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

export function getHitIcon(hit: Hit): string {
  switch (hit.category) {
    case HitCategory.Attack:
      return "🗡️";
    case HitCategory.Defend:
      return "🛡️";
    case HitCategory.Dodge:
      return "💫";
    case HitCategory.Capture:
      return "🕸️";
    case HitCategory.Special:
      return "💥";
    // case HitCategory.DexAction:
    //   return "💫";
    // case HitCategory.StrAction:
    //   return "🦾";
    // case HitCategory.IntAction:
    //   return "📚";
    // case HitCategory.ConAction:
    //   return "❤️‍🔥";
    // case HitCategory.SizAction:
    //   return "🐋";
    // case HitCategory.AppAction:
    //   return "✨";
    case HitCategory.None:
      return "❔";
    default:
      return "";
  }
}

const attrNameMap: Record<string, string> = {
  str: "力量", dex: "敏捷", con: "体质", int: "智力",
  siz: "体型", app: "魅力",
};

export function getActionIcons(action: Action): string {
  return action.hits.map(h => getHitIcon(h)).join("");
}

export function generateActionPopoverContent(player: Player, action: Action): string {
  const hitsHtml = action.hits.map((hit, i) => {
    const icon = getHitIcon(hit);
    const chainTag = hit.continuous ? `<span class="act-chain">🔗</span>` : "";
    const idxTag = action.hits.length > 1 ? `<span class="act-idx">#${i + 1}</span>` : "";

    const min = calculateMinPower(hit.coeff, player.getAbility(), player.getActionCoeff(hit.category));
    const max = calculateMaxPower(hit.coeff, player.getAbility(), player.getActionCoeff(hit.category));
    const rangeStr = `<span class="act-range-val">${min}</span>~<span class="act-range-val">${max}</span>`;

    const coeffEntries = Object.entries(hit.coeff).filter(([, v]) => v);
    const coeffHtml = coeffEntries.length > 0
      ? `<div class="act-coeff-grid"><span class="act-coeff-label">系数:</span>${coeffEntries.map(([k, v]) =>
          `<span class="act-coeff">${attrNameMap[k] || k} <span class="act-coeff-val">${v}</span></span>`
        ).join("")}</div>`
      : "";

    return `<div class="act-hit act-hit-${hit.category}">
      <div class="act-hit-hdr">${idxTag}<span class="act-hit-icon">${icon}</span>${chainTag}${rangeStr}</div>
      ${coeffHtml}
    </div>`;
  }).join("");

  return `<div class="act-card">
    <div class="act-desc">"${action.description}"</div>
    ${hitsHtml}
  </div>`;
}
