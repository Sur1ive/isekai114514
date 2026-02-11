import { defineStore } from "pinia";
import { shallowRef, ref } from "vue";
import type { Monster } from "@/creatures/Monster";
import type { BattleResult } from "@/battle/types";

export enum BattleContext {
  NormalMonster = "NormalMonster",
  Boss = "Boss",
  StartPage = "StartPage",
}

export const useBattleStore = defineStore("battle", () => {
  const enemy = shallowRef<Monster | null>(null);
  const context = ref<BattleContext>(BattleContext.NormalMonster);
  const lastResult = ref<BattleResult | null>(null);

  function startBattle(newEnemy: Monster, battleContext: BattleContext) {
    enemy.value = newEnemy;
    context.value = battleContext;
    lastResult.value = null;
  }

  function clearBattle() {
    enemy.value = null;
    lastResult.value = null;
  }

  return { enemy, context, lastResult, startBattle, clearBattle };
});
