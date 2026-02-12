<template>
  <Teleport to="body">
    <div class="dice-overlay" @click="handleClick">
      <div class="dice-backdrop" />

      <div class="dice-content">
        <!-- 招式名 -->
        <div class="dice-action-names">
          <span class="action-player">{{ playerActionName }}</span>
          <span class="action-vs">vs</span>
          <span class="action-enemy">{{ enemyActionName }}</span>
        </div>

        <!-- 拼点计数 -->
        <div class="dice-header">
          第 {{ currentIndex + 1 }} / {{ rolls.length }} 次拼点
        </div>

        <!-- 拼点竞技场（有效拼点 & 无事发生共用布局） -->
        <template v-if="currentRoll">
          <div class="dice-arena">
            <!-- 玩家侧 -->
            <div
              class="dice-side"
              :class="{
                'side-damaged': phase === 'result' && currentRoll.damageTarget === 'player' && currentRoll.damage > 0,
              }"
            >
              <div class="dice-name player-color">{{ currentRoll.playerName }}</div>
              <div class="dice-icon-display">{{ currentRoll.playerHitIcon }}</div>
              <div
                class="dice-box player-box"
                :class="{
                  rolling: !currentRoll.isNothing && phase === 'rolling',
                  winner: !currentRoll.isNothing && phase === 'result' && currentRoll.result === PlayerWin,
                  loser: !currentRoll.isNothing && phase === 'result' && currentRoll.result === EnemyWin,
                  'nothing-box': currentRoll.isNothing,
                }"
              >
                <span v-if="currentRoll.isNothing" class="dice-na">—</span>
                <span v-else-if="currentRoll.playerPower >= 0" class="dice-number">
                  {{ displayPlayerPower }}
                </span>
                <span v-else class="dice-na">—</span>
              </div>
              <!-- 玩家血条 -->
              <div class="hp-bar-wrapper">
                <div class="hp-bar-bg">
                  <div
                    class="hp-bar-fill"
                    :style="{
                      width: playerHpPercent + '%',
                      background: hpBarColor(playerHpPercent),
                    }"
                  />
                </div>
                <div class="hp-bar-text">{{ displayPlayerHp }} / {{ playerMaxHp }}</div>
              </div>
            </div>

            <!-- VS -->
            <div class="dice-vs">VS</div>

            <!-- 敌人侧 -->
            <div
              class="dice-side"
              :class="{
                'side-damaged': phase === 'result' && currentRoll.damageTarget === 'enemy' && currentRoll.damage > 0,
              }"
            >
              <div class="dice-name enemy-color">{{ currentRoll.enemyName }}</div>
              <div class="dice-icon-display">{{ currentRoll.enemyHitIcon }}</div>
              <div
                class="dice-box enemy-box"
                :class="{
                  rolling: !currentRoll.isNothing && phase === 'rolling',
                  winner: !currentRoll.isNothing && phase === 'result' && currentRoll.result === EnemyWin,
                  loser: !currentRoll.isNothing && phase === 'result' && currentRoll.result === PlayerWin,
                  'nothing-box': currentRoll.isNothing,
                }"
              >
                <span v-if="currentRoll.isNothing" class="dice-na">—</span>
                <span v-else-if="currentRoll.enemyPower >= 0" class="dice-number">
                  {{ displayEnemyPower }}
                </span>
                <span v-else class="dice-na">—</span>
              </div>
              <!-- 敌人血条 -->
              <div class="hp-bar-wrapper">
                <div class="hp-bar-bg">
                  <div
                    class="hp-bar-fill"
                    :style="{
                      width: enemyHpPercent + '%',
                      background: hpBarColor(enemyHpPercent),
                    }"
                  />
                </div>
                <div class="hp-bar-text">{{ displayEnemyHp }} / {{ enemyMaxHp }}</div>
              </div>
            </div>
          </div>

          <!-- 结果区域 -->
          <Transition name="result-slide">
            <div v-if="phase === 'result'" class="dice-result-section">
              <div class="dice-result-divider" />

              <!-- 无事发生提示 -->
              <div v-if="currentRoll.isNothing" class="dice-nothing-result">
                无事发生
              </div>

              <!-- 叙事文字 -->
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-else class="dice-result-message" v-html="currentRoll.resultMessage" />

              <!-- 伤害数字 -->
              <div
                v-if="!currentRoll.isNothing && currentRoll.damage > 0"
                class="dice-damage"
                :class="{
                  'damage-to-player': currentRoll.damageTarget === 'player',
                  'damage-to-enemy': currentRoll.damageTarget === 'enemy',
                }"
              >
                <span class="damage-icon">{{ currentRoll.damageTarget === 'player' ? '💔' : '💥' }}</span>
                <span class="damage-target-name">{{ damageTargetName }}</span>
                <span class="damage-number">-{{ currentRoll.damage }}</span>
                <span class="damage-label">HP</span>
              </div>

              <!-- 无伤害结果 -->
              <div v-else-if="!currentRoll.isNothing && currentRoll.damage === 0 && currentRoll.damageTarget === 'none'" class="dice-no-damage">
                🛡️ 未造成伤害
              </div>
            </div>
          </Transition>
        </template>

        <div class="dice-hint">{{ hintText }}</div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { PointComparisonResult } from "@/battle/types";
import type { DiceRollData } from "@/battle/types";

const PlayerWin = PointComparisonResult.PlayerWin;
const EnemyWin = PointComparisonResult.EnemyWin;

const props = defineProps<{
  rolls: DiceRollData[];
  playerActionName: string;
  enemyActionName: string;
  playerHpStart: number;
  enemyHpStart: number;
  playerMaxHp: number;
  enemyMaxHp: number;
  autoMode: boolean;
}>();

const emit = defineEmits<{
  complete: [];
}>();

const currentIndex = ref(0);
const phase = ref<"idle" | "rolling" | "settled" | "result">("idle");
const displayPlayerPower = ref(0);
const displayEnemyPower = ref(0);

// 血条相关
const displayPlayerHp = ref(0);
const displayEnemyHp = ref(0);

const playerHpPercent = computed(() =>
  props.playerMaxHp > 0 ? Math.max(0, (displayPlayerHp.value / props.playerMaxHp) * 100) : 0,
);
const enemyHpPercent = computed(() =>
  props.enemyMaxHp > 0 ? Math.max(0, (displayEnemyHp.value / props.enemyMaxHp) * 100) : 0,
);

function hpBarColor(percent: number): string {
  if (percent > 50) return "#2ed573";
  if (percent > 25) return "#ffa502";
  return "#ff4757";
}

let rollingTimer: number | undefined;
let settleTimer: number | undefined;
let resultTimer: number | undefined;
let nextTimer: number | undefined;

const currentRoll = computed(() => props.rolls[currentIndex.value] ?? null);

const hintText = computed(() => {
  if (phase.value === "result" && !props.autoMode) return "点击继续";
  return "点击加速";
});

const damageTargetName = computed(() => {
  const roll = currentRoll.value;
  if (!roll) return "";
  if (roll.damageTarget === "player") return roll.playerName;
  if (roll.damageTarget === "enemy") return roll.enemyName;
  return "";
});

function clearAllTimers() {
  if (rollingTimer !== undefined) clearInterval(rollingTimer);
  if (settleTimer !== undefined) clearTimeout(settleTimer);
  if (resultTimer !== undefined) clearTimeout(resultTimer);
  if (nextTimer !== undefined) clearTimeout(nextTimer);
  rollingTimer = undefined;
  settleTimer = undefined;
  resultTimer = undefined;
  nextTimer = undefined;
}

function startHit() {
  clearAllTimers();
  const roll = currentRoll.value;
  if (!roll) {
    emit("complete");
    return;
  }

  if (roll.isNothing) {
    // 先短暂展示双方行动图标，再显示"无事发生"结果
    phase.value = "idle";
    settleTimer = window.setTimeout(() => {
      phase.value = "result";
      displayPlayerHp.value = roll.playerHpAfter;
      displayEnemyHp.value = roll.enemyHpAfter;
      if (props.autoMode) {
        nextTimer = window.setTimeout(() => {
          goNext();
        }, 800);
      }
      // 手动模式：停在 result，等待点击
    }, 500);
    return;
  }

  // 直接开始滚动（手动模式在结果后暂停，无需 waiting 阶段）
  beginRolling();
}

/** 开始掷骰滚动动画 */
function beginRolling() {
  clearAllTimers();
  const roll = currentRoll.value;
  if (!roll) return;

  phase.value = "rolling";
  const maxVal = Math.max(
    roll.playerPower > 0 ? roll.playerPower : 10,
    roll.enemyPower > 0 ? roll.enemyPower : 10,
  );
  const rollRange = Math.max(Math.ceil(maxVal * 1.5), 20);

  rollingTimer = window.setInterval(() => {
    if (roll.playerPower >= 0) {
      displayPlayerPower.value = Math.floor(Math.random() * rollRange);
    }
    if (roll.enemyPower >= 0) {
      displayEnemyPower.value = Math.floor(Math.random() * rollRange);
    }
  }, 70);

  // 滚动结束，定格数字
  settleTimer = window.setTimeout(() => {
    if (rollingTimer !== undefined) clearInterval(rollingTimer);
    rollingTimer = undefined;
    displayPlayerPower.value = roll.playerPower >= 0 ? roll.playerPower : 0;
    displayEnemyPower.value = roll.enemyPower >= 0 ? roll.enemyPower : 0;
    phase.value = "settled";

    // 短暂停顿后显示结果
    resultTimer = window.setTimeout(() => {
      showResult(roll);
    }, 400);
  }, 1200);
}

/** 进入 result 阶段，更新血条，自动模式下设置前进计时器 */
function showResult(roll: DiceRollData) {
  phase.value = "result";
  displayPlayerHp.value = roll.playerHpAfter;
  displayEnemyHp.value = roll.enemyHpAfter;

  if (props.autoMode) {
    nextTimer = window.setTimeout(() => {
      goNext();
    }, 1200);
  }
  // 手动模式：停在 result，等待点击
}

function goNext() {
  clearAllTimers();
  if (currentIndex.value < props.rolls.length - 1) {
    currentIndex.value++;
    startHit();
  } else {
    emit("complete");
  }
}

function handleClick() {
  const roll = currentRoll.value;
  if (!roll) {
    emit("complete");
    return;
  }

  if (phase.value === "rolling") {
    // 跳过滚动，直接显示结果
    clearAllTimers();
    if (roll.playerPower >= 0) displayPlayerPower.value = roll.playerPower;
    if (roll.enemyPower >= 0) displayEnemyPower.value = roll.enemyPower;
    showResult(roll);
    if (props.autoMode) {
      // 自动模式下缩短等待
      clearAllTimers();
      nextTimer = window.setTimeout(() => {
        goNext();
      }, 400);
    }
  } else if (phase.value === "settled") {
    clearAllTimers();
    showResult(roll);
    if (props.autoMode) {
      clearAllTimers();
      nextTimer = window.setTimeout(() => {
        goNext();
      }, 400);
    }
  } else if (phase.value === "result") {
    clearAllTimers();
    goNext();
  }
}

onMounted(() => {
  displayPlayerHp.value = props.playerHpStart;
  displayEnemyHp.value = props.enemyHpStart;
  startHit();
});

onBeforeUnmount(() => {
  clearAllTimers();
});
</script>

<style scoped>
.dice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}

.dice-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(4px);
}

.dice-content {
  position: relative;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 24px 32px 20px;
  min-width: 400px;
  max-width: 92vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: content-enter 0.25s ease-out;
}

@keyframes content-enter {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(16px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ====== 招式名 ====== */
.dice-action-names {
  text-align: center;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
}

.action-player {
  color: #4a9eff;
}

.action-vs {
  color: rgba(255, 255, 255, 0.35);
  margin: 0 10px;
  font-weight: 400;
  font-size: 13px;
}

.action-enemy {
  color: #ff6b4a;
}

/* ====== 拼点计数 ====== */
.dice-header {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin-bottom: 18px;
  letter-spacing: 2px;
}

/* ====== 竞技场 ====== */
.dice-arena {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.dice-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 110px;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.dice-side.side-damaged {
  animation: side-shake 0.4s ease-out;
  background: rgba(255, 50, 50, 0.08);
}

@keyframes side-shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(5px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(3px); }
  75% { transform: translateX(-2px); }
}

.dice-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.player-color {
  color: #4a9eff;
}

.enemy-color {
  color: #ff6b4a;
}

.dice-icon-display {
  font-size: 24px;
  margin-bottom: 8px;
}

/* ====== 血条 ====== */
.hp-bar-wrapper {
  width: 100%;
  margin-top: 8px;
}

.hp-bar-bg {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.hp-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease, background 0.6s ease;
  box-shadow: 0 0 6px rgba(46, 213, 115, 0.3);
}

.hp-bar-text {
  text-align: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  font-family: "Courier New", monospace;
  font-weight: 600;
}

/* ====== 骰子框 ====== */
.dice-box {
  width: 82px;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.4);
  transition: all 0.35s ease;
}

.dice-box.player-box {
  border-color: rgba(74, 158, 255, 0.4);
}

.dice-box.enemy-box {
  border-color: rgba(255, 107, 74, 0.4);
}

.dice-box.rolling {
  animation: dice-shake 0.12s infinite;
}

.dice-box.rolling .dice-number {
  filter: blur(1px);
}

.dice-box.winner {
  border-color: #ffd700;
  box-shadow: 0 0 24px rgba(255, 215, 0, 0.5), inset 0 0 12px rgba(255, 215, 0, 0.15);
  transform: scale(1.12);
}

.dice-box.winner .dice-number {
  color: #ffd700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
}

.dice-box.loser {
  opacity: 0.35;
  transform: scale(0.88);
  border-color: rgba(255, 255, 255, 0.08);
}

@keyframes dice-shake {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(-2px) translateY(1px); }
  50% { transform: translateX(1px) translateY(-2px); }
  75% { transform: translateX(2px) translateY(1px); }
}

.dice-number {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  font-family: "Courier New", monospace;
  transition: filter 0.2s ease;
}

.dice-na {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.2);
}

.dice-vs {
  font-size: 18px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.1);
  padding: 0 2px;
  margin-top: 32px;
}

/* ====== 结果区域 ====== */
.dice-result-section {
  margin-top: 16px;
}

.dice-result-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  margin-bottom: 14px;
}

.dice-result-message {
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 10px;
  white-space: pre-wrap;
}

/* ====== 伤害数字 ====== */
.dice-damage {
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  padding: 6px 0;
  animation: damage-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes damage-pop {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.damage-to-player {
  color: #ff4757;
  text-shadow: 0 0 16px rgba(255, 71, 87, 0.6);
}

.damage-to-enemy {
  color: #2ed573;
  text-shadow: 0 0 16px rgba(46, 213, 115, 0.6);
}

.damage-icon {
  margin-right: 6px;
}

.damage-target-name {
  margin-right: 4px;
  font-size: 14px;
  opacity: 0.8;
}

.damage-number {
  font-size: 28px;
  font-family: "Courier New", monospace;
  margin-right: 4px;
}

.damage-label {
  font-size: 14px;
  opacity: 0.7;
}

.dice-no-damage {
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  padding: 4px 0;
}

/* ====== 无事发生 ====== */
.dice-box.nothing-box {
  border-color: rgba(255, 255, 255, 0.08);
  opacity: 0.5;
}

.dice-nothing-result {
  text-align: center;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.45);
  padding: 4px 0;
  font-weight: 600;
  letter-spacing: 2px;
}

/* ====== 底部提示 ====== */
.dice-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.18);
  font-size: 11px;
  margin-top: 14px;
}

/* ====== Vue Transition ====== */
.result-slide-enter-active {
  transition: all 0.35s ease-out;
}

.result-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
</style>
