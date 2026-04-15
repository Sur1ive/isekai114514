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
    <button
      type="button"
      class="battle-help-btn"
      style="position: absolute; right: 24px; top: 174px; z-index: 999"
      @click="showTutorial = true"
    >
      ?
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
        <div class="card-header bg-danger text-white" style="cursor: pointer" @click="enemyCardCollapsed = !enemyCardCollapsed">
          <h4 class="mb-0">
            {{ currentEnemy.name }}
            <span style="font-size: 12px; margin-left: 10px" class="badge bg-secondary">lv.{{ currentEnemy.level }}</span>
          </h4>
        </div>
        <div class="card-body">
          <template v-if="!enemyCardCollapsed">
            <!-- 怪物立绘 -->
            <div v-if="currentEnemy.image" class="enemy-portrait">
              <img :src="currentEnemy.image" :alt="currentEnemy.name" class="enemy-portrait-img" />
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p class="card-text fst-italic" v-html="'&quot;' + currentEnemy.description + '&quot;'"></p>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p class="card-text" v-html="enemyActionObservation"></p>
          </template>
          <div v-else class="enemy-collapsed-info">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="enemyActionObservation"></span>
          </div>
          <div class="battle-hp-bar">
            <div class="battle-hp-bar-bg">
              <div
                class="battle-hp-bar-prev"
                :style="{ width: (prevEnemyHp / currentEnemy.getMaxHealth() * 100) + '%' }"
              ></div>
              <div
                class="battle-hp-bar-fill battle-hp-bar-enemy"
                :style="{ width: (currentEnemy.health / currentEnemy.getMaxHealth() * 100) + '%' }"
              ></div>
              <!-- Boss 永久削减阈值线：当前血量 - 20%最大生命值 -->
              <div
                v-if="battleStore.context === BattleContext.Boss && (bossHpSnapshot - currentEnemy.getMaxHealth() * 0.2) > 0"
                class="battle-hp-tick battle-hp-tick-threshold"
                :style="{ left: ((bossHpSnapshot - currentEnemy.getMaxHealth() * 0.2) / currentEnemy.getMaxHealth() * 100) + '%' }"
              ></div>
              <div class="battle-hp-bar-text">
                {{ Math.ceil(currentEnemy.health) }} / {{ Math.ceil(currentEnemy.getMaxHealth()) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分割线 -->
      <hr />

      <!-- 玩家信息 + 宠物 -->
      <div class="d-flex gap-3 mb-4 align-items-stretch">
        <div class="card flex-grow-1" style="min-width: 0">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0">{{ player.name }} <span style="opacity: 0.5; font-size: 0.7em">{{ creatureConfigs[player.type].typeName }}</span> <span style="font-size: 12px; margin-left: 10px" class="badge bg-secondary">lv.{{ player.level }}</span></h4>
          </div>
          <div class="card-body">
            <div class="battle-hp-bar">
              <div class="battle-hp-bar-bg">
                <div
                  class="battle-hp-bar-prev"
                  :style="{ width: (prevPlayerHp / player.getMaxHealth() * 100) + '%' }"
                ></div>
                <div
                  class="battle-hp-bar-fill battle-hp-bar-player"
                  :style="{ width: (player.health / player.getMaxHealth() * 100) + '%' }"
                ></div>
                <div class="battle-hp-bar-text">
                  {{ Math.ceil(player.health) }} / {{ Math.ceil(player.getMaxHealth()) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="getActivePet() && !battleEnded" class="battle-pet-side">
          <span class="battle-pet-side-name">🐾 {{ getActivePet()!.name }}</span>
          <div class="battle-pet-hp-bg">
            <div class="battle-pet-hp-fill" :style="{ width: (getActivePet()!.health / getActivePet()!.getMaxHealth() * 100) + '%' }" />
            <span class="battle-pet-hp-text">{{ Math.ceil(getActivePet()!.health) }}/{{ Math.ceil(getActivePet()!.getMaxHealth()) }}</span>
          </div>
          <span v-if="getActivePet()!.isFainted" class="battle-pet-faint-label">昏迷</span>
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
              获得经验: <span class="text-info">{{ earnedExp }}</span><span v-if="player.level - currentEnemy.level > 3" class="text-muted" style="font-size: 12px"> (等级压制)</span><span v-else-if="currentEnemy.level > player.level" class="text-warning" style="font-size: 12px"> (战胜强敌)</span>
              <span v-if="droppedItem">
                获得物品: <span :class="'text-' + Rarity[droppedItem.rarity]">{{ droppedItem.name }}</span>
              </span>
            </p>
          </h4>
          <div v-if="bossPermanentDamage > 0" class="boss-damage-card mt-3 mb-3">
            <div class="boss-damage-name">{{ bossResultName }}</div>
            <div class="boss-damage-hp">
              <span class="boss-damage-current">{{ bossResultHpAfter }}</span>
              <span class="boss-damage-sep"> / </span>
              <span class="boss-damage-max">{{ bossResultMaxHp }}</span>
            </div>
            <div class="boss-damage-number">
              💥-{{ bossPermanentDamage }}
            </div>
          </div>
          <img
            v-if="battleResult === BattleResult.Lose"
            :src="neverGonnaGiveUp"
            alt=""
            style="max-width: 100%; border-radius: 8px; margin-bottom: 12px"
          />
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
    :pet-hits="dicePetHits"
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

  <!-- 战斗教程弹窗 -->
  <Teleport to="body">
    <div v-if="showTutorial" class="battle-log-overlay" @click.self="showTutorial = false">
      <div class="battle-log-panel tutorial-panel">
        <div class="battle-log-header">
          <h5 class="mb-0">战斗机制说明</h5>
          <button type="button" class="btn-close btn-close-white" aria-label="关闭" @click="showTutorial = false" />
        </div>
        <div class="battle-log-body tutorial-body">
          <section class="tut-section">
            <h6 class="tut-title">行动列表</h6>
            <p>每回合从<strong>行动列表</strong>中按权重随机抽取两个行动以供选择。行动列表由<strong>种族</strong>决定基础内容，<strong>装备</strong>可以额外追加新的行动。</p>
          </section>

          <section class="tut-section">
            <h6 class="tut-title">基本流程</h6>
            <p>每个行动由若干个<strong>动作</strong>组成。选择行动后，双方的动作按顺序一一对应进行<strong>拼点</strong>，点数由属性和系数决定。</p>
          </section>

          <section class="tut-section">
            <h6 class="tut-title">动作类型</h6>
            <div class="tut-types">
              <div class="tut-type-row">
                <span class="tut-icon">🗡️</span>
                <div>
                  <strong>攻击</strong>
                  <span class="tut-desc">拼点胜利可以造成伤害</span>
                </div>
              </div>
              <div class="tut-type-row">
                <span class="tut-icon">🛡️</span>
                <div>
                  <strong>防御</strong>
                  <span class="tut-desc">无论拼点是否胜利，按照点数抵消攻击</span>
                </div>
              </div>
              <div class="tut-type-row">
                <span class="tut-icon">💫</span>
                <div>
                  <strong>闪避</strong>
                  <span class="tut-desc">若闪避点数 ≥ 攻击点数，可以躲避并使对方<strong>失衡</strong>；否则受到全额伤害</span>
                </div>
              </div>
              <div class="tut-type-row">
                <span class="tut-icon">🕸️</span>
                <div>
                  <strong>捕捉</strong>
                  <span class="tut-desc">视为攻击进行拼点，胜利后有概率捕获对方（概率与属性和对方属性即剩余 HP 相关）</span>
                </div>
              </div>
              <div class="tut-type-row">
                <span class="tut-icon">❔</span>
                <div>
                  <strong>无动作</strong>
                  <span class="tut-desc">无动作，对方若为攻击则无条件命中</span>
                </div>
              </div>
            </div>
          </section>

          <section class="tut-section">
            <h6 class="tut-title">交互关系</h6>
            <table class="tut-table">
              <thead>
                <tr>
                  <th />
                  <th>🗡️ 攻击</th>
                  <th>🛡️ 防御</th>
                  <th>💫 闪避</th>
                  <th>❔ 无</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="tut-row-header">🗡️ 攻击</td>
                  <td>点高者胜<br/>造成伤害</td>
                  <td>攻击-防御<br/>差值为伤害</td>
                  <td>攻击＞闪避<br/>则命中</td>
                  <td>无条件<br/>命中</td>
                </tr>
                <tr>
                  <td class="tut-row-header">🛡️ 防御</td>
                  <td>攻击-防御<br/>差值为伤害</td>
                  <td colspan="3" class="tut-nothing">无事发生</td>
                </tr>
                <tr>
                  <td class="tut-row-header">💫 闪避</td>
                  <td>攻击＞闪避<br/>则命中</td>
                  <td colspan="3" class="tut-nothing">无事发生</td>
                </tr>
                <tr>
                  <td class="tut-row-header">❔ 无</td>
                  <td>无条件<br/>命中</td>
                  <td colspan="3" class="tut-nothing">无事发生</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="tut-section">
            <h6 class="tut-title">其他机制</h6>
            <ul class="tut-list">
              <li><strong>连续动作 🔗</strong>：前一个动作命中后才会触发的动作，若前一个动作未命中则不会触发</li>
              <li><strong>失衡</strong>：闪避成功时攻击方会失衡，失去同一个行动内之后的所有动作</li>
              <li><strong>观察</strong>：根据智力属性之差，可能可以看穿敌方招式</li>
            </ul>
          </section>
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
import { handleAction, handlePetAction } from "@/battle/actionInteractions";
import { observeEnemyAction } from "@/battle/battle";
import { getHitsDescription } from "@/actions/actionUtils";
import { StatusCategory, StatusEffectMap } from "@/creatures/status/Status";
import { statusConfigs, StatusType } from "@/creatures/status/statusConfigs";
import { BattleResult } from "@/battle/types";
import type { DiceRollData, BattleRoundLog } from "@/battle/types";
import { Rarity } from "@/types";
import type { Action } from "@/actions/Action";
import type { Monster } from "@/creatures/Monster";
import { creatureConfigs } from "@/creatures/creatureConfigs";
import type { Item } from "@/items/Item";
import { Equipment } from "@/items/Equipment";
import { Consumable } from "@/items/Consumable";
import { ConsumableType } from "@/items/consumableConfigs";
import { showToast } from "@/utils/toast";
import DiceOverlay from "@/components/DiceOverlay.vue";
import neverGonnaGiveUp from "@/assets/never-gonna-give-up.gif";
import BattleLogContent from "@/components/BattleLogContent.vue";

const router = useRouter();
const playerStore = usePlayerStore();
const battleStore = useBattleStore();

const player = playerStore.player!;
// 使用非响应式变量存储 Monster 以避免 Vue ShallowRef 丢失 private 字段的类型问题
let enemyObj: Monster | null = null;
let bossHpSnapshot = 0;
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
const earnedExp = ref(0);
const bossPermanentDamage = ref(0);
const bossResultName = ref("");
const bossResultHpAfter = ref(0);
const bossResultMaxHp = ref(0);

// 血条：上回合 HP 快照（用于显示掉血过渡色）
const prevPlayerHp = ref(0);
const prevEnemyHp = ref(0);

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

export interface PetHitSummary {
  petName: string;
  actionName: string;
  hitIcon: string;
  dealtDamage: number;
  receivedDamage: number;
  fainted: boolean;
}
const dicePetHits = ref<PetHitSummary[]>([]);

// 战斗记录弹窗
const showBattleLog = ref(false);
const battleRoundsLog = ref<BattleRoundLog[]>([]);

// 教程弹窗
const showTutorial = ref(false);

// 怪物卡片折叠
const enemyCardCollapsed = ref(false);

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
  bossHpSnapshot = enemyObj.health;
  prevPlayerHp.value = player.health;
  prevEnemyHp.value = enemyObj.health;
  triggerRender();
  player.isAtHome = false;
  prepareNextTurn();
});

function getActivePet(): Monster | null {
  if (player.activePetIndex < 0 || player.activePetIndex >= player.capturedMonster.length) return null;
  return player.capturedMonster[player.activePetIndex] as Monster;
}

/**
 * 玩家选择动作后：执行战斗结算 → 播放掷骰动画 → 准备下一回合
 */
function chooseAction(chosen: Action) {
  if (isAnimating.value) return; // 动画期间忽略点击

  const playerAction = chosen;
  const enemyAct = enemyAction.value!;
  const enemy = enemyObj!;

  // 更新上回合 HP 快照（本回合开始前的 HP）
  prevPlayerHp.value = player.health;
  prevEnemyHp.value = enemy.health;

  // 记录结算前的 HP 快照
  const pHpStart = Math.ceil(player.health);
  const eHpStart = Math.ceil(enemy.health);

  // 同步执行战斗结算（HP 已更新，但被掷骰遮罩覆盖，玩家看不到）
  player.addTempLog("--------------------------回合-----------------------------");
  const rolls = handleAction(player, enemy, playerAction, enemyAct);

  // 宠物参战（静默结算，生成逐hit摘要）
  dicePetHits.value = [];
  let roundPetName: string | undefined;
  let roundPetActionName: string | undefined;
  let roundPetRolls: DiceRollData[] | undefined;
  const activePet = getActivePet();
  if (activePet && !activePet.isFainted && enemy.health > 0) {
    const petAction = activePet.getRandomAction();
    const petRolls = handlePetAction(activePet, enemy, petAction, enemyAct, activePet.getPetDamageMultiplier());
    roundPetName = activePet.name;
    roundPetActionName = petAction.name;
    roundPetRolls = [...petRolls];
    player.addTempLog(`🐾 ${activePet.name} 使用了 ${petAction.name}`);
    const hits: PetHitSummary[] = [];
    for (const r of petRolls) {
      const dealt = r.damageTarget === "enemy" ? r.damage : 0;
      const recv = r.damageTarget === "player" ? r.damage : 0;
      hits.push({
        petName: activePet.name,
        actionName: petAction.name,
        hitIcon: r.playerHitIcon,
        dealtDamage: dealt,
        receivedDamage: recv,
        fainted: false,
      });
      const parts: string[] = [`  ${r.playerHitIcon}`];
      if (dealt > 0) parts.push(`对${enemy.name}造成 <span style="color:green">${dealt}</span> 伤害`);
      if (recv > 0) parts.push(`受到 <span style="color:red">${recv}</span> 伤害`);
      if (r.isNothing) parts.push("无事发生");
      if (dealt === 0 && recv === 0 && !r.isNothing) parts.push(r.resultMessage);
      player.addTempLog(parts.join(" "));
    }
    if (activePet.health <= 0) {
      activePet.isFainted = true;
      if (hits.length > 0) hits[hits.length - 1].fainted = true;
      player.addTempLog(`<span style="color:red">${activePet.name} 倒下了！需要休息恢复。</span>`);
    }
    dicePetHits.value = hits;
  }

  // 记录结构化回合数据
  battleRoundsLog.value.push({
    roundNumber: battleRoundsLog.value.length + 1,
    playerActionName: playerAction.name,
    enemyActionName: enemyAct.name,
    rolls: [...rolls],
    petName: roundPetName,
    petActionName: roundPetActionName,
    petRolls: roundPetRolls,
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
  bossPermanentDamage.value = 0;

  if (battleStore.context === BattleContext.Boss && (result === BattleResult.Lose || result === BattleResult.Withdraw)) {
    const damageDealt = bossHpSnapshot - enemy.health;
    if (damageDealt > enemy.getMaxHealth() * 0.2) {
      bossPermanentDamage.value = Math.ceil(damageDealt);
      bossResultName.value = enemy.name;
      bossResultHpAfter.value = Math.ceil(enemy.health);
      bossResultMaxHp.value = Math.ceil(enemy.getMaxHealth());
    }
  }

  if (result === BattleResult.Win) {
    const drop = enemy.randomDropItem();
    if (drop) {
      if (drop instanceof Equipment && drop.rarity === Rarity.Unique) {
        drop.syncLevel(player.level);
      }
      drop.showItemToast();
      droppedItem.value = drop;
    }
    const levelDiff = player.level - enemy.level;
    let expFactor = 1;
    if (levelDiff < 0) {
      expFactor = Math.min(1.5, 1 - levelDiff * 0.1);
    } else if (levelDiff > 0) {
      expFactor = Math.max(0.1, 1 - levelDiff * 0.1);
    }
    const actualExp = Math.floor(enemy.giveExp * expFactor);
    earnedExp.value = actualExp;
    player.exp += actualExp;
    leveledUp.value = player.checkLevelUp();
    player.exp = Math.floor(player.exp);
    if (leveledUp.value) {
      const potion = new Consumable(ConsumableType.LifePotion);
      player.pack.push(potion);
      showToast("🎉 升级奖励", `升级了！获得了 ${potion.getItemIcon()} <strong>${potion.getName()}</strong>！`, {
        headerClass: "bg-primary text-white",
      });
    }
    // 宠物获得经验
    const activePet = getActivePet();
    if (activePet) {
      const petExpGain = Math.floor(actualExp * 0.5);
      if (petExpGain > 0) {
        const petLeveled = activePet.addExp(petExpGain);
        if (petLeveled) {
          player.addLog(`🐾 ${activePet.name} 升级到了 Lv.${activePet.level}！`);
        }
      }
    }
    player.addLog(enemy.name + "掉落了<span style='color: gold;'>" + (drop?.name ?? "无") + "</span>");
    if (drop) {
      player.pack.push(drop);
    }
    // 捕捉成功：新宠物恢复到50%血量
    const lastPet = player.capturedMonster[player.capturedMonster.length - 1];
    if (lastPet && lastPet === enemy) {
      lastPet.health = Math.ceil(lastPet.getMaxHealth() * 0.5);
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
      const damageDealt = bossHpSnapshot - enemy.health;
      if (damageDealt > enemy.getMaxHealth() * 0.2) {
        // 永久削减：保留战斗后的血量
      } else {
        // 伤害不足：恢复到战斗前的血量
        enemy.health = bossHpSnapshot;
      }
      playerStore.save();
      router.push({ name: "main-menu" });
    } else {
      // Win
      const bossNodeId = player.currentMapData.bossNodeId;
      const bossList = bossNodeId ? player.persistedBoss[bossNodeId] : undefined;
      if (bossList) {
        bossList.shift();
      }
      if (bossList && bossList.length > 0) {
        // 下一阶段 Boss
        const nextBoss = bossList[0] as Monster;
        enemyObj = nextBoss;
        bossHpSnapshot = nextBoss.health;
        prevEnemyHp.value = nextBoss.health;
        triggerRender();
        battleStore.startBattle(nextBoss, BattleContext.Boss);
        battleEnded.value = false;
        battleResult.value = null;
        prepareNextTurn();
        return;
      }
      if (bossNodeId) {
        delete player.persistedBoss[bossNodeId];
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
/* ====== 战斗血条 ====== */
.battle-hp-bar {
  margin: 4px 0;
}

.battle-hp-bar-bg {
  position: relative;
  height: 16px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.battle-hp-bar-prev {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #f5c6cb;
  border-radius: 4px 0 0 4px;
  transition: width 0.3s ease;
}

.battle-hp-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px 0 0 4px;
  transition: width 0.3s ease;
}

.battle-hp-bar-player {
  background: #28a745;
}

.battle-hp-bar-enemy {
  background: #dc3545;
}

.battle-hp-tick {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  z-index: 1;
}

.battle-hp-tick-threshold {
  width: 2px;
  background: #ffc107;
  box-shadow: 0 0 4px rgba(255, 193, 7, 0.6);
}

.boss-damage-card {
  background: linear-gradient(135deg, #1a472a, #2d6a4f);
  border: 2px solid #52b788;
  border-radius: 10px;
  padding: 16px 20px;
  color: #fff;
  text-align: center;
}

.boss-damage-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffd60a;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.boss-damage-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.boss-damage-hp {
  font-size: 15px;
  margin-bottom: 8px;
}

.boss-damage-current {
  color: #ff6b6b;
  font-weight: 700;
}

.boss-damage-sep {
  opacity: 0.5;
}

.boss-damage-max {
  opacity: 0.7;
}

.boss-damage-number {
  font-size: 32px;
  font-weight: 900;
  color: #ffd60a;
  text-shadow: 0 2px 8px rgba(255, 214, 10, 0.4);
  line-height: 1;
}

.battle-hp-bar-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.enemy-portrait {
  text-align: center;
  margin-bottom: 12px;
}

.enemy-portrait-img {
  max-height: 200px;
  max-width: 100%;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.enemy-collapsed-info {
  font-size: 13px;
  color: #495057;
  margin-bottom: 8px;
}

/* ====== 帮助按钮 ====== */
.battle-help-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(33, 37, 41, 0.85);
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  line-height: 1;
}

.battle-help-btn:hover {
  background: rgba(33, 37, 41, 1);
  border-color: rgba(255, 255, 255, 0.6);
  color: #fff;
}

/* ====== 教程面板 ====== */
.tutorial-panel {
  max-width: 640px;
}

.tutorial-body {
  font-size: 13px;
  line-height: 1.7;
}

.tut-section {
  margin-bottom: 18px;
}

.tut-section:last-child {
  margin-bottom: 0;
}

.tut-title {
  color: #ffd700;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
}

.tut-types {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tut-type-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.tut-icon {
  font-size: 20px;
  flex-shrink: 0;
  width: 28px;
  text-align: center;
}

.tut-desc {
  display: block;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  margin-top: 1px;
}

/* 交互关系表 */
.tut-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  text-align: center;
  margin-top: 4px;
}

.tut-table th,
.tut-table td {
  padding: 6px 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  vertical-align: middle;
}

.tut-table th {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.tut-row-header {
  background: rgba(255, 255, 255, 0.04);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.tut-nothing {
  color: rgba(255, 255, 255, 0.25);
  font-style: italic;
}

.tut-list {
  padding-left: 18px;
  margin: 0;
}

.tut-list li {
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.7);
}

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
