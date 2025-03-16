import { Creature } from "../creatures/Creature";
import { Player } from "../creatures/Player";
import type { Monster } from "../creatures/Monster";

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
