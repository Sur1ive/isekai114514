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
    <button
      type="button"
      class="btn btn-dark"
      style="position: absolute; right: 20px; top: 80px; z-index: 999"
      @click="showBattleLog = true"
    >
      📜 记录
    </button>
    <button
      type="button"
      class="btn btn-dark"
      style="position: absolute; right: 20px; top: 125px; z-index: 999"
      @click="showSettings = !showSettings"
    >
      ⚙️ 设置
    </button>
    <!-- 设置面板遮罩 -->
    <div
      v-if="showSettings"
      style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999"
      @click="showSettings = false"
    />
    <!-- 设置面板 -->
    <div v-if="showSettings" class="battle-settings-panel" @click.stop>
      <div class="settings-title">战斗设置</div>
      <div class="form-check form-switch">
        <input
          id="autoModeSwitch"
          v-model="diceAutoMode"
          class="form-check-input"
          type="checkbox"
          @change="saveDiceMode"
        >
        <label class="form-check-label" for="autoModeSwitch">
          {{ diceAutoMode ? '自动掷骰' : '手动掷骰' }}
        </label>
      </div>
      <div class="settings-desc">
        {{ diceAutoMode ? '掷骰动画自动播放，点击可加速' : '每次拼点需要手动点击触发' }}
      </div>
    </div>

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
          <button class="btn btn-dark" @click="showBattleLog = true">📜 战斗记录</button>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" @click="handleContinue">继续</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 掷骰拼点特效 -->
  <DiceOverlay
    v-if="showDice"
    :rolls="diceRollsData"
    :player-action-name="dicePlayerActionName"
    :enemy-action-name="diceEnemyActionName"
    :player-hp-start="dicePlayerHpStart"
    :enemy-hp-start="diceEnemyHpStart"
    :player-max-hp="dicePlayerMaxHp"
    :enemy-max-hp="diceEnemyMaxHp"
    :auto-mode="diceAutoMode"
    @complete="onDiceComplete"
  />

  <!-- 战斗记录弹窗 -->
  <Teleport to="body">
    <div v-if="showBattleLog" class="battle-log-overlay" @click.self="showBattleLog = false">
      <div class="battle-log-panel">
        <div class="battle-log-header">
          <h5 class="mb-0">战斗记录</h5>
          <button type="button" class="btn-close btn-close-white" aria-label="关闭" @click="showBattleLog = false" />
        </div>
        <div class="battle-log-body">
          <BattleLogContent :rounds="battleRoundsLog" />
        </div>
      </div>
    </div>
  </Teleport>
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
import type { DiceRollData, BattleRoundLog } from "@/battle/types";
import { Rarity } from "@/types";
import type { Action } from "@/actions/Action";
import type { Monster } from "@/creatures/Monster";
import type { Item } from "@/items/Item";
import DiceOverlay from "@/components/DiceOverlay.vue";
import BattleLogContent from "@/components/BattleLogContent.vue";

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

// 掷骰动画状态
const diceRollsData = ref<DiceRollData[]>([]);
const dicePlayerActionName = ref("");
const diceEnemyActionName = ref("");
const dicePlayerHpStart = ref(0);
const diceEnemyHpStart = ref(0);
const dicePlayerMaxHp = ref(0);
const diceEnemyMaxHp = ref(0);
const showDice = ref(false);
const isAnimating = ref(false);

// 战斗记录弹窗
const showBattleLog = ref(false);
const battleRoundsLog = ref<BattleRoundLog[]>([]);

// 设置面板
const showSettings = ref(false);
const diceAutoMode = ref(localStorage.getItem("battleDiceAutoMode") === "true");

function saveDiceMode() {
  localStorage.setItem("battleDiceAutoMode", String(diceAutoMode.value));
}

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
  prepareNextTurn();
});

/**
 * 玩家选择动作后：执行战斗结算 → 播放掷骰动画 → 准备下一回合
 */
function chooseAction(chosen: Action) {
  if (isAnimating.value) return; // 动画期间忽略点击

  const playerAction = chosen;
  const enemyAct = enemyAction.value!;
  const enemy = enemyObj!;

  // 记录结算前的 HP 快照
  const pHpStart = Math.ceil(player.health);
  const eHpStart = Math.ceil(enemy.health);

  // 同步执行战斗结算（HP 已更新，但被掷骰遮罩覆盖，玩家看不到）
  player.addTempLog("--------------------------回合-----------------------------");
  const rolls = handleAction(player, enemy, playerAction, enemyAct);

  // 记录结构化回合数据
  battleRoundsLog.value.push({
    roundNumber: battleRoundsLog.value.length + 1,
    playerActionName: playerAction.name,
    enemyActionName: enemyAct.name,
    rolls: [...rolls],
  });

  if (rolls.length > 0) {
    diceRollsData.value = rolls;
    dicePlayerActionName.value = playerAction.name;
    diceEnemyActionName.value = enemyAct.name;
    dicePlayerHpStart.value = pHpStart;
    diceEnemyHpStart.value = eHpStart;
    dicePlayerMaxHp.value = player.getMaxHealth();
    diceEnemyMaxHp.value = enemy.getMaxHealth();
    showDice.value = true;
    isAnimating.value = true;
  } else {
    prepareNextTurn();
  }
}

/** 掷骰动画完成后的回调 */
function onDiceComplete() {
  showDice.value = false;
  isAnimating.value = false;
  triggerRender();
  prepareNextTurn();
}

/**
 * 准备下一回合：生成新动作、处理回合开始状态、检查胜负
 */
function prepareNextTurn() {
  const enemy = enemyObj!;

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
  triggerRender();
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
        prepareNextTurn();
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

<style scoped>
.battle-settings-panel {
  position: absolute;
  right: 20px;
  top: 170px;
  z-index: 1000;
  background: rgba(33, 37, 41, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 14px 18px;
  min-width: 180px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
  color: #fff;
}

.settings-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.settings-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 6px;
}

.battle-log-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
}

.battle-log-panel {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  width: 90%;
  max-width: 600px;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.battle-log-header {
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  flex-shrink: 0;
}

.battle-log-body {
  padding: 16px 20px;
  overflow-y: auto;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.7;
  flex: 1;
  min-height: 0;
}
</style>
