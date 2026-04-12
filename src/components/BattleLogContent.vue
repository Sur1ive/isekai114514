<template>
  <div class="blog-content">
    <div v-if="rounds.length === 0" class="blog-empty">暂无战斗记录</div>

    <div v-for="round in rounds" :key="round.roundNumber" class="blog-round">
      <!-- 回合标题 -->
      <div class="blog-round-header">
        <div class="blog-round-divider">
          <span class="blog-round-label">回合 {{ round.roundNumber }}</span>
        </div>
        <div class="blog-round-actions">
          <span class="blog-action-player">{{ round.playerActionName }}</span>
          <span class="blog-action-vs">vs</span>
          <span class="blog-action-enemy">{{ round.enemyActionName }}</span>
        </div>
      </div>

      <!-- 每次 hit -->
      <div v-for="(roll, idx) in round.rolls" :key="idx" class="blog-hit">
        <!-- 拼点概览行 -->
        <div class="blog-hit-overview">
          <div class="blog-hit-left">
            <span class="blog-icon">{{ roll.playerHitIcon }}</span>
            <span
              v-if="!roll.isNothing && roll.playerPower >= 0"
              class="blog-power"
              :class="{
                'power-win': roll.result === PlayerWin,
                'power-lose': roll.result === EnemyWin,
              }"
            >{{ roll.playerPower }}</span>
          </div>

          <div class="blog-hit-center">
            <template v-if="roll.isNothing">—</template>
            <template v-else>vs</template>
          </div>

          <div class="blog-hit-right">
            <span
              v-if="!roll.isNothing && roll.enemyPower >= 0"
              class="blog-power"
              :class="{
                'power-win': roll.result === EnemyWin,
                'power-lose': roll.result === PlayerWin,
              }"
            >{{ roll.enemyPower }}</span>
            <span class="blog-icon">{{ roll.enemyHitIcon }}</span>
          </div>

        </div>

        <!-- 结果详情 -->
        <div v-if="!roll.isNothing" class="blog-hit-detail">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="blog-message" v-html="roll.resultMessage" />
          <div
            v-if="roll.damage > 0"
            class="blog-damage"
            :class="roll.damageTarget === 'player' ? 'dmg-player' : 'dmg-enemy'"
          >
            {{ roll.damageTarget === 'player' ? '💔' : '💥' }}
            {{ roll.damageTarget === 'player' ? roll.playerName : roll.enemyName }}
            -{{ roll.damage }} HP
          </div>
          <div v-else-if="roll.damage === 0 && roll.damageTarget === 'none'" class="blog-no-damage">
            🛡️ 未造成伤害
          </div>
        </div>
        <div v-else class="blog-hit-detail blog-nothing-detail">
          无事发生
        </div>
      </div>

      <!-- 宠物拼点记录 -->
      <template v-if="round.petRolls && round.petRolls.length > 0">
        <div class="blog-pet-header">
          <span class="blog-pet-label">🐾 {{ round.petName }}</span>
          <span class="blog-pet-action">{{ round.petActionName }}</span>
        </div>
        <div v-for="(pr, pi) in round.petRolls" :key="'pet-' + pi" class="blog-hit blog-hit-pet">
          <div class="blog-hit-overview">
            <div class="blog-hit-left">
              <span class="blog-icon">{{ pr.playerHitIcon }}</span>
              <span
                v-if="!pr.isNothing && pr.playerPower >= 0"
                class="blog-power"
                :class="{
                  'power-win': pr.result === PlayerWin,
                  'power-lose': pr.result === EnemyWin,
                }"
              >{{ pr.playerPower }}</span>
            </div>
            <div class="blog-hit-center">
              <template v-if="pr.isNothing">—</template>
              <template v-else>vs</template>
            </div>
            <div class="blog-hit-right">
              <span
                v-if="!pr.isNothing && pr.enemyPower >= 0"
                class="blog-power"
                :class="{
                  'power-win': pr.result === EnemyWin,
                  'power-lose': pr.result === PlayerWin,
                }"
              >{{ pr.enemyPower }}</span>
              <span class="blog-icon">{{ pr.enemyHitIcon }}</span>
            </div>
          </div>
          <div v-if="!pr.isNothing" class="blog-hit-detail">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="blog-message" v-html="pr.resultMessage" />
            <div
              v-if="pr.damage > 0"
              class="blog-damage"
              :class="pr.damageTarget === 'player' ? 'dmg-player' : 'dmg-enemy'"
            >
              {{ pr.damageTarget === 'player' ? '💔' : '💥' }}
              {{ pr.damageTarget === 'player' ? pr.playerName : pr.enemyName }}
              -{{ pr.damage }} HP
            </div>
            <div v-else-if="pr.damage === 0 && pr.damageTarget === 'none'" class="blog-no-damage">
              🛡️ 未造成伤害
            </div>
          </div>
          <div v-else class="blog-hit-detail blog-nothing-detail">
            无事发生
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PointComparisonResult } from "@/battle/types";
import type { BattleRoundLog } from "@/battle/types";

const PlayerWin = PointComparisonResult.PlayerWin;
const EnemyWin = PointComparisonResult.EnemyWin;

defineProps<{
  rounds: BattleRoundLog[];
}>();

</script>

<style scoped>
.blog-content {
  padding: 0;
}

.blog-empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  padding: 32px 0;
  font-size: 14px;
}

/* ====== 回合 ====== */
.blog-round {
  margin-bottom: 20px;
}

.blog-round:last-child {
  margin-bottom: 0;
}

.blog-round-header {
  margin-bottom: 10px;
}

.blog-round-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.blog-round-divider::before,
.blog-round-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
}

.blog-round-label {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
}

.blog-round-actions {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}

.blog-action-player {
  color: #4a9eff;
}

.blog-action-vs {
  color: rgba(255, 255, 255, 0.25);
  margin: 0 8px;
  font-size: 12px;
  font-weight: 400;
}

.blog-action-enemy {
  color: #ff6b4a;
}

/* ====== Hit 卡片 ====== */
.blog-hit {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 6px;
}

.blog-hit:last-child {
  margin-bottom: 0;
}

/* 概览行 */
.blog-hit-overview {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.blog-hit-left {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: flex-end;
}

.blog-hit-center {
  color: rgba(255, 255, 255, 0.25);
  font-size: 11px;
  min-width: 20px;
  text-align: center;
}

.blog-hit-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.blog-icon {
  font-size: 16px;
}

.blog-power {
  font-family: "Courier New", monospace;
  font-weight: 700;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
}

.blog-power.power-win {
  color: #ffd700;
  text-shadow: 0 0 4px rgba(255, 215, 0, 0.3);
}

.blog-power.power-lose {
  color: rgba(255, 255, 255, 0.25);
}

/* 详情区 */
.blog-hit-detail {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.blog-message {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.blog-damage {
  font-size: 13px;
  font-weight: 700;
  margin-top: 3px;
}

.dmg-player {
  color: #ff4757;
}

.dmg-enemy {
  color: #2ed573;
}

.blog-no-damage {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 3px;
}

.blog-nothing-detail {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  border-top: none;
  padding-top: 4px;
}

/* ====== 宠物记录 ====== */
.blog-pet-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 4px;
  padding-left: 4px;
}

.blog-pet-label {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 200, 50, 0.8);
}

.blog-pet-action {
  font-size: 12px;
  color: rgba(255, 200, 50, 0.5);
}

.blog-hit-pet {
  border-left: 3px solid rgba(255, 200, 50, 0.3);
  background: rgba(255, 200, 50, 0.03);
}
</style>
