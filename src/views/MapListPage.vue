<template>
  <div v-if="player">
    <div class="mt-auto">
      <div class="row g-3 justify-content-center">
        <!-- 没有可用区域 -->
        <template v-if="regionList.length === 0">
          <div class="col-12 text-center">
            <p class="text-danger">没有可用的地图区域。</p>
          </div>
        </template>

        <!-- 区域列表 -->
        <div v-for="region in regionList" :key="region.id" class="col-12 col-md-4">
          <button class="btn btn-primary w-100 py-3" @click="goToRegion(region)">
            {{ region.name }}
          </button>
        </div>

        <div class="col-12 col-md-4">
          <button class="btn btn-success w-100 py-3" @click="router.push({ name: 'main-menu' })">返回主菜单</button>
        </div>
      </div>
    </div>

    <!-- 底部区域：占位 -->
    <div class="mt-auto"></div>
    <div class="mt-auto"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { getRegionById, Region } from "@/maps/Region";

const router = useRouter();
const playerStore = usePlayerStore();

const player = computed(() => playerStore.player);

const regionList = computed(() => {
  if (!player.value) return [];
  return player.value.unlockedRegionIdList
    .map((regionId) => getRegionById(regionId))
    .filter((region): region is Region => !!region);
});

function goToRegion(region: Region) {
  if (!player.value) return;
  if (getRegionById(region.id)?.isOpen) {
    player.value.goToRegion(region.id);
    router.push({ name: "main-menu" });
  } else {
    alert("前面的区域以后再来探索吧？");
  }
}
</script>
