<template>
  <!-- 战斗进行中 -->
  <div v-if="!battleEnded && currentEnemy && player">
    <button
      type="button"
      class="btn btn-primary"
      style="position: absolute; left: 20px; top: 80px; z-index: 999"
      @click="flee"
    >
      逃跑
    </button>

    <div class="container mt-4">
      <h2 class="text-center mb-3">战斗</h2>

      <!-- 敌人信息 -->
      <div class="card mb-3">
        <div class="card-header bg-danger text-white">
          <h4 class="mb-0">
            {{ currentEnemy.name }}
            <span style="font-size: 12px; margin-left: 10px" class="badge bg-secondary">lv.{{ currentEnemy.level }}</span>
          </h4>
        </div>
        <div class="card-body">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="card-text fst-italic" v-html="'&quot;' + currentEnemy.description + '&quot;'"></p>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="card-text" v-html="enemyActionObservation"></p>
          <p class="card-text">HP: <strong>{{ Math.ceil(currentEnemy.health) }}</strong></p>
        </div>
      </div>

      <!-- 分割线 -->
      <hr />

      <!-- 玩家信息 -->
      <div class="card mb-4">
        <div class="card-header bg-success text-white">
          <h4 class="mb-0">{{ player.name }}</h4>
        </div>
        <div class="card-body">
          <p class="card-text">HP: <strong>{{ Math.ceil(player.health) }}</strong></p>
        </div>
      </div>

      <!-- 动作选择 -->
      <div v-if="action1 && action2" class="row mb-4">
        <div class="col-6">
          <div class="card bg-primary text-white" style="cursor: pointer" @click="chooseAction(action1)">
            <div class="card-body text-center">
              <h5 class="card-title">{{ action1.name }}</h5>
              <p class="card-text fst-italic">"{{ action1.description }}"</p>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p class="card-text" v-html="getHitsDescription(player, action1)"></p>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="card bg-info text-white" style="cursor: pointer" @click="chooseAction(action2)">
            <div class="card-body text-center">
              <h5 class="card-title">{{ action2.name }}</h5>
              <p class="card-text fst-italic">"{{ action2.description }}"</p>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p class="card-text" v-html="getHitsDescription(player, action2)"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- 战斗记录 -->
      <div class="card">
        <div class="card-header">记录</div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="card-body" style="max-height: 200px; overflow-y: auto" v-html="player.getTempLogs()"></div>
      </div>
    </div>
  </div>

  <!-- 战斗结束界面 -->
  <div v-else-if="battleEnded && currentEnemy && player">
    <div class="container mt-4">
      <div class="card text-center shadow">
        <div class="card-header bg-dark text-white">
          <h2 class="mb-0">战斗结束</h2>
        </div>
        <div class="card-body">
          <h4 class="card-title">
            {{ player.name }}
            <span v-if="battleResult === BattleResult.Win" class="text-success">胜利</span>
            <span v-else-if="battleResult === BattleResult.Lose" class="text-danger">失败</span>
            <span v-else-if="battleResult === BattleResult.EnemyEscape" class="text-warning">敌人逃跑了</span>
            <span v-else class="text-warning">逃跑</span>
            <p>
              lv: {{ player.level }}{{ leveledUp ? "🔺" : "" }} exp: {{ player.exp }}/{{ player.getNextLevelExp() }}
            </p>
            <p v-if="battleResult === BattleResult.Win">
              获得经验: <span class="text-info">{{ Math.floor(currentEnemy.giveExp) }}</span>
              <span v-if="droppedItem">
                获得物品: <span :class="'text-' + Rarity[droppedItem.rarity]">{{ droppedItem.name }}</span>
              </span>
            </p>
          </h4>
          <hr />
          <h5>记录</h5>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="border rounded p-3" style="max-height: 250px; overflow-y: auto" v-html="player.getTempLogs()"></div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" @click="handleContinue">继续</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { useBattleStore, BattleContext } from "@/stores/battleStore";
import { handleAction } from "@/battle/actionInteractions";
import { observeEnemyAction } from "@/battle/battle";
import { getHitsDescription } from "@/actions/actionUtils";
import { StatusCategory, StatusEffectMap } from "@/creatures/status/Status";
import { statusConfigs, StatusType } from "@/creatures/status/statusConfigs";
import { BattleResult } from "@/battle/types";
import { Rarity } from "@/types";
import type { Action } from "@/actions/Action";
import type { Monster } from "@/creatures/Monster";
import type { Item } from "@/items/Item";

const router = useRouter();
const playerStore = usePlayerStore();
const battleStore = useBattleStore();

const player = playerStore.player!;
// 使用非响应式变量存储 Monster 以避免 Vue ShallowRef 丢失 private 字段的类型问题
let enemyObj: Monster | null = null;
const renderTick = ref(0);
const currentEnemy = computed(() => {
  renderTick.value;
  return enemyObj;
});
const action1 = ref<Action | null>(null);
const action2 = ref<Action | null>(null);
const enemyAction = ref<Action | null>(null);
const enemyActionObservation = ref("");
const battleEnded = ref(false);
const battleResult = ref<BattleResult | null>(null);
const leveledUp = ref(false);
const droppedItem = ref<Item | null>(null);

function triggerRender() {
  renderTick.value++;
}

onMounted(() => {
  if (!battleStore.enemy || !player) {
    router.push({ name: "main-menu" });
    return;
  }
  enemyObj = battleStore.enemy as Monster;
  triggerRender();
  player.isAtHome = false;
  prepareTurn(null, null);
});

function prepareTurn(lastPlayerAction: Action | null, lastEnemyAction: Action | null) {
  const enemy = enemyObj!;

  // 上回合结算
  if (lastPlayerAction && lastEnemyAction) {
    player.addTempLog("--------------------------回合-----------------------------");
    handleAction(player, enemy, lastPlayerAction, lastEnemyAction);
  }

  // 本回合准备阶段
  let newEnemyAction = enemy.getRandomAction();
  const observation = observeEnemyAction(player, enemy, newEnemyAction);
  let newAction1 = player.getRandomAction();
  let newAction2 = player.getRandomAction();

  // 按照优先级从小往大处理OnTurnStart status
  player.statuses
    .sort((a, b) => a.priority - b.priority)
    .forEach((status) => {
      if (status.category === StatusCategory.OnTurnStart) {
        const effect = statusConfigs[status.type].effect as StatusEffectMap[StatusCategory.OnTurnStart];
        const actions = effect(player, newAction1, newAction2);
        newAction1 = actions.action1;
        newAction2 = actions.action2;
      }
    });

  enemy.statuses
    .sort((a, b) => a.priority - b.priority)
    .forEach((status) => {
      if (status.category === StatusCategory.OnTurnStart) {
        const effect = statusConfigs[status.type].effect as StatusEffectMap[StatusCategory.OnTurnStart];
        const actions = effect(enemy, newEnemyAction!, newEnemyAction!);
        newEnemyAction = actions.action1;
      }
    });

  player.updateStatusesOnTurnStart();
  enemy.updateStatusesOnTurnStart();

  // 检查是否结束
  if (player.health <= 0) {
    player.addLog(player.name + "撑不住了");
    player.clearStatus();
    endBattle(BattleResult.Lose);
    return;
  }
  if (enemy.health < 1) {
    player.addLog(player.name + "击败了" + enemy.name);
    player.clearStatus();
    endBattle(BattleResult.Win);
    return;
  }
  if (enemy.statuses.some((status) => status.type === StatusType.Escaped)) {
    player.addLog(enemy.name + "逃跑了");
    endBattle(BattleResult.EnemyEscape);
    return;
  }

  playerStore.save();

  // 更新 UI 状态
  action1.value = newAction1;
  action2.value = newAction2;
  enemyAction.value = newEnemyAction;
  enemyActionObservation.value = observation;
}

function chooseAction(chosen: Action) {
  prepareTurn(chosen, enemyAction.value);
}

function flee() {
  endBattle(BattleResult.Withdraw);
}

function endBattle(result: BattleResult) {
  const enemy = enemyObj!;
  leveledUp.value = false;
  droppedItem.value = null;

  if (result === BattleResult.Win) {
    const drop = enemy.randomDropItem();
    if (drop) {
      drop.showItemToast();
      droppedItem.value = drop;
    }
    player.exp += Math.floor(enemy.giveExp);
    leveledUp.value = player.checkLevelUp();
    player.exp = Math.floor(player.exp);
    player.addLog(enemy.name + "掉落了<span style='color: gold;'>" + (drop?.name ?? "无") + "</span>");
    if (drop) {
      player.pack.push(drop);
    }
  } else if (result === BattleResult.Lose) {
    player.health = 1;
    player.addLog(player.name + "拼死从" + enemy.name + "的手中逃了出来，拖着残破的身躯，回到了城镇");
  } else if (result === BattleResult.Withdraw) {
    player.addLog(player.name + "在与" + enemy.name + "的战斗中逃跑了");
  } else if (result === BattleResult.EnemyEscape) {
    player.addLog(enemy.name + "逃跑了");
  }

  battleResult.value = result;
  battleEnded.value = true;
}

function handleContinue() {
  const result = battleResult.value!;
  const enemy = enemyObj!;
  const ctx = battleStore.context;

  player.clearTempLogs();
  playerStore.save();

  if (ctx === BattleContext.Boss) {
    if (result === BattleResult.Lose || result === BattleResult.Withdraw) {
      const bossMonster = player.currentMapData.boss[0] as Monster;
      const bossHealthBefore = bossMonster.health;
      const bossHealthAfter = enemy.health;
      if (bossHealthBefore - bossHealthAfter > enemy.getMaxHealth() * 0.2) {
        bossMonster.health = bossHealthAfter;
      }
      playerStore.save();
      router.push({ name: "main-menu" });
    } else {
      // Win
      player.currentMapData.boss.shift();
      if (player.currentMapData.boss.length > 0) {
        // 下一阶段 Boss
        const nextBoss = player.currentMapData.boss[0] as Monster;
        enemyObj = nextBoss;
        triggerRender();
        battleStore.startBattle(nextBoss, BattleContext.Boss);
        battleEnded.value = false;
        battleResult.value = null;
        prepareTurn(null, null);
        return;
      }
      if (player.currentMapData.goingToNodeId) {
        player.goToNode(player.currentMapData.goingToNodeId);
        router.push({ name: "map" });
      } else {
        router.push({ name: "main-menu" });
      }
    }
  } else if (ctx === BattleContext.NormalMonster) {
    if (result === BattleResult.Lose || result === BattleResult.Withdraw || !player.currentMapData.goingToNodeId) {
      router.push({ name: "main-menu" });
    } else {
      player.goToNode(player.currentMapData.goingToNodeId);
      router.push({ name: "map" });
    }
  } else if (ctx === BattleContext.StartPage) {
    battleStore.lastResult = result;
    router.push({
      name: "start",
      query: { afterBattle: result === BattleResult.Win ? "win" : "lose" },
    });
  }
}
</script>
