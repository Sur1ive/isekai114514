<template>
  <div v-if="player" class="main-menu-root">
    <!-- 角色信息区 -->
    <div class="d-flex gap-3 mb-3 align-items-stretch">
      <div class="card shadow-sm" style="flex: 1; min-width: 0">
        <div class="card-body pb-2">
          <div class="text-center">
            <h2 class="card-title mb-1">
              <span
                class="badge ms-2"
                :class="player.type === CreatureType.Player114514 ? 'bg-danger' : 'bg-primary'"
                style="font-size: 0.75rem; padding: 0.35em 0.5em"
              >
                {{ player.type === CreatureType.Player114514 ? "野兽" : "人类" }}
              </span>
              {{ player.name }}
              <small class="text-muted"> lv {{ player.level }}</small>
            </h2>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div id="exp-display" class="mt-2" style="max-width: 200px; margin: 0 auto" v-html="player.getExpDisplay()"></div>
          </div>
          <div class="text-center mt-2">
            <img :src="playerImage" alt="玩家形象" class="img-fluid" style="max-height: 180px" />
          </div>
        </div>
      </div>
      <div v-if="activePetDisplay" class="card shadow-sm main-pet-card">
        <div class="card-body d-flex flex-column align-items-center justify-content-center p-2">
          <div class="main-pet-card-icon">🐾</div>
          <div class="main-pet-card-name">{{ activePetDisplay.name }}</div>
          <div class="main-pet-card-lv">Lv.{{ activePetDisplay.level }}</div>
          <div class="main-pet-card-hp-text">{{ activePetDisplay.hp }}/{{ activePetDisplay.max }}</div>
          <div v-if="activePetDisplay.fainted" class="main-pet-card-fainted">昏迷</div>
        </div>
      </div>
    </div>

    <!-- 血条 -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div id="health-display" class="mb-2" v-html="healthDisplay"></div>

    <!-- 生命之泉 -->
    <div class="life-spring-card mb-4">
      <div class="d-flex align-items-center gap-2">
        <span class="life-spring-icon">🌊</span>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="life-spring-label">生命之泉</span>
            <span class="life-spring-amount">
              {{ springDisplay.current }} / {{ springDisplay.max }}
              <span v-if="springDisplay.current < springDisplay.max" class="life-spring-rate">+{{ springDisplay.rate }}/s</span>
            </span>
          </div>
          <div class="progress life-spring-bar">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated life-spring-bar-fill"
              role="progressbar"
              :style="{ width: springDisplay.percent + '%' }"
            ></div>
          </div>
        </div>
        <button
          class="btn btn-sm life-spring-btn"
          @click="useSpring"
        >
          喝
        </button>
      </div>
    </div>

    <!-- 主操作区 -->
    <div class="menu-actions">
      <button class="menu-btn menu-btn-go" @click="goToMap">
        <span class="menu-btn-icon">🗺️</span>
        <span class="menu-btn-text">
          {{ player.type === CreatureType.Player114514 ? "救世啊！" : "动身探索" }}
          <small class="menu-btn-sub">{{ currentRegionName }}</small>
        </span>
      </button>
      <div class="d-flex gap-2">
        <button class="menu-btn menu-btn-secondary flex-fill" @click="router.push({ name: 'map-list' })">
          <span class="menu-btn-icon">🧭</span> 快速旅行
        </button>
        <button class="menu-btn menu-btn-secondary flex-fill" @click="router.push({ name: 'status' })">
          <span class="menu-btn-icon">📋</span> 状态/背包
        </button>
      </div>
      <div class="d-flex gap-2">
        <button
          class="menu-btn menu-btn-misc flex-fill"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
        >
          📜 记录
        </button>
        <button class="menu-btn menu-btn-danger flex-fill" @click="restart">
          💀 秽土转生
        </button>
      </div>
    </div>

    <!-- Offcanvas 记录面板 -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRightLabel">记录</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="关闭"></button>
      </div>
      <div class="offcanvas-body">
        <div style="max-height: 60vh; overflow-y: auto">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="player.getLastNLog(100)"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { CreatureType } from "@/creatures/creatureConfigs";
import { Player } from "@/creatures/Player";
import { getRegionById } from "@/maps/Region";
import playerImage from "@/assets/player.gif";

const router = useRouter();
const playerStore = usePlayerStore();

const player = computed(() => playerStore.player);

// 血条与泉水需要实时更新
const healthDisplay = ref("");
const baseSpringRate = Player.LIFE_SPRING_MAX / Player.LIFE_SPRING_REFILL_SECONDS;
const springDisplay = ref({ current: 0, max: Player.LIFE_SPRING_MAX, percent: 0, rate: baseSpringRate.toFixed(2) });
let prevSpringVal = -1;
const activePetDisplay = computed(() => {
  const p = player.value;
  if (!p || p.activePetIndex < 0 || p.activePetIndex >= p.capturedMonster.length) return null;
  const pet = p.capturedMonster[p.activePetIndex];
  return {
    name: pet.name,
    level: pet.level,
    hp: Math.ceil(pet.health),
    max: Math.ceil(pet.getMaxHealth()),
    percent: Math.min(100, (pet.health / pet.getMaxHealth()) * 100),
    fainted: pet.isFainted,
  };
});
let healthInterval: number | undefined;

const currentRegionName = computed(() => {
  if (!player.value) return "";
  const region = getRegionById(player.value.currentMapData.currentRegionId);
  return region?.name || "未知";
});

onMounted(() => {
  if (!player.value) {
    router.push({ name: "start" });
    return;
  }
  player.value.isAtHome = true;
  player.value.clearCurrentMapData();
  playerStore.save();
  playerStore.updateTitle();

  const updateDisplays = () => {
    if (playerStore.player) {
      healthDisplay.value = playerStore.player.getHealthDisplay();
      const s = playerStore.player.lifeSpring;
      const max = Player.LIFE_SPRING_MAX;
      let rate = baseSpringRate;
      if (prevSpringVal >= 0 && s > prevSpringVal) {
        rate = s - prevSpringVal;
      }
      prevSpringVal = s;
      springDisplay.value = {
        current: Math.floor(s),
        max,
        percent: Math.min(100, (s / max) * 100),
        rate: rate.toFixed(2),
      };
    }
  };
  updateDisplays();
  healthInterval = window.setInterval(updateDisplays, 1000);
});

onBeforeUnmount(() => {
  if (healthInterval !== undefined) {
    clearInterval(healthInterval);
  }
});

function goToMap() {
  if (!player.value) return;
  const currentRegion = getRegionById(player.value.currentMapData.currentRegionId);
  if (currentRegion) {
    player.value.goToNode(currentRegion.startNode.id);
    router.push({ name: "map" });
  }
}

function useSpring() {
  if (!player.value) return;
  const healed = player.value.useLifeSpring();
  if (healed > 0) {
    player.value.addLog(`摸了生命之泉，回复了 ${healed.toFixed(1)} 点生命`);
    healthDisplay.value = player.value.getHealthDisplay();
    const s = player.value.lifeSpring;
    prevSpringVal = s;
    springDisplay.value = {
      current: Math.floor(s),
      max: Player.LIFE_SPRING_MAX,
      percent: Math.min(100, (s / Player.LIFE_SPRING_MAX) * 100),
      rate: baseSpringRate.toFixed(2),
    };
    playerStore.save();
  }
}

function restart() {
  if (window.confirm("你确定要 remake 吗？")) {
    playerStore.reset();
    window.location.reload();
  }
}
</script>
