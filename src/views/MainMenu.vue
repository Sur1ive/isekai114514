<template>
  <div v-if="player">
    <!-- 顶部区域：角色卡片 + 宠物卡片并排 -->
    <div class="d-flex gap-3 mb-4 align-items-stretch">
      <!-- 角色卡片 -->
      <div class="card shadow-sm" style="flex: 1; min-width: 0">
        <div class="card-body">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div id="health-display" class="mb-3" v-html="healthDisplay"></div>
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
          <div class="text-center mt-3">
            <img :src="playerImage" alt="玩家形象" class="img-fluid" style="max-height: 200px" />
          </div>
        </div>
      </div>
      <!-- 宠物卡片 -->
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

    <!-- 主菜单区域：用 mt-auto 自动向下推 -->
    <div class="mt-auto">
      <div class="row g-3 justify-content-center">
        <div class="col-12 col-md-4">
          <button class="btn btn-primary w-100 py-3" @click="goToMap">
            {{ player.type === CreatureType.Player114514 ? "救世啊！" : "动身" }} 现在地点: {{ currentRegionName }}
          </button>
        </div>
        <div class="col-12 col-md-4">
          <button class="btn btn-primary w-100 py-3" @click="router.push({ name: 'map-list' })">快速旅行</button>
        </div>
        <div class="col-12 col-md-4">
          <button class="btn btn-success w-100 py-3" @click="router.push({ name: 'status' })">状态/背包</button>
        </div>
        <div class="col-12 col-md-4">
          <button class="btn btn-danger w-100 py-3" @click="restart">秽土转生</button>
        </div>
      </div>

      <!-- 查看记录按钮 -->
      <div class="text-center mt-4">
        <button class="btn btn-info" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
          查看记录
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

    <!-- 底部区域：占位 -->
    <div class="mt-auto"></div>
    <div class="mt-auto"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { CreatureType } from "@/creatures/creatureConfigs";
import { getRegionById } from "@/maps/Region";
import playerImage from "@/assets/player.gif";

const router = useRouter();
const playerStore = usePlayerStore();

const player = computed(() => playerStore.player);

// 血条需要实时更新，使用独立的 ref + 定时器
const healthDisplay = ref("");

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
  player.value.clearCurrentMapDataWithoutBoss();
  playerStore.save();
  playerStore.updateTitle();

  // 定时刷新血条显示
  const updateHealth = () => {
    if (playerStore.player) {
      healthDisplay.value = playerStore.player.getHealthDisplay();
    }
  };
  updateHealth();
  healthInterval = window.setInterval(updateHealth, 1000);
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

function restart() {
  if (window.confirm("你确定要 remake 吗？")) {
    playerStore.reset();
    window.location.reload();
  }
}
</script>
