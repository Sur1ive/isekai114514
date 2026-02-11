<template>
  <div v-if="player" :key="renderKey" class="container mt-4">
    <h2 class="text-center mb-4">状态</h2>

    <div class="row">
      <!-- 属性栏区域 -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">{{ player.name }} 的属性</h4>
            <div>
              <span class="badge bg-primary">可用加点: <span>{{ player.plusAbilityPoint }}</span></span>
            </div>
          </div>
          <div class="card-body">
            <div id="attribute-bar" class="list-group list-group-flush">
              <div
                v-for="[attr, value] in abilityEntries"
                :key="attr"
                class="list-group-item d-flex justify-content-between align-items-center"
                :data-attr="attr"
              >
                <span class="fw-bold">{{ attributeNameMap[attr] || attr }}</span>
                <div class="d-flex align-items-center">
                  <span class="text-muted me-2">{{ value }}</span>
                  <span v-if="getExtraAbilityValue(attr) > 0" class="badge bg-success ms-1">+{{ getExtraAbilityValue(attr) }}</span>
                  <span v-else-if="getExtraAbilityValue(attr) < 0" class="badge bg-danger ms-1">{{ getExtraAbilityValue(attr) }}</span>
                  <span v-if="getPlusAbilityValue(attr) > 0" class="badge bg-info ms-1">+{{ getPlusAbilityValue(attr) }}</span>
                  <button
                    v-if="!nonPlusableAttributes.includes(attr) && player.plusAbilityPoint > 0"
                    class="btn btn-sm btn-outline-primary ms-1"
                    @click="plusAttribute(attr)"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 行动列表区域 -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-secondary text-white">
            <h4 class="card-title mb-0">{{ player.name }} 的行动列表</h4>
          </div>
          <div class="card-body">
            <!-- Tab 导航 -->
            <ul class="nav nav-underline mb-3">
              <li class="nav-item">
                <button class="nav-link" :class="{ active: actionTab === 'extra' }" @click="actionTab = 'extra'">装备额外行动</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: actionTab === 'base' }" @click="actionTab = 'base'">基础行动</button>
              </li>
            </ul>
            <!-- 装备额外行动列表 -->
            <div v-if="actionTab === 'extra'">
              <ul class="list-group">
                <li
                  v-for="action in sortedExtraActions"
                  :key="action.actionType"
                  class="list-group-item"
                  tabindex="0"
                  data-bs-toggle="popover"
                  data-bs-trigger="focus"
                  data-bs-html="true"
                  :data-bs-title="actionConfigs[action.actionType].name"
                  :data-bs-content="generateActionPopoverContent(player!, actionConfigs[action.actionType])"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <span>{{ actionConfigs[action.actionType].name }}</span>
                    <span :class="'badge bg-' + Rarity[actionConfigs[action.actionType].rarity]">{{ action.weight.toFixed(2) }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 基础行动列表 -->
            <div v-else>
              <ul class="list-group">
                <li
                  v-for="action in sortedBaseActions"
                  :key="action.actionType"
                  class="list-group-item"
                  tabindex="0"
                  data-bs-toggle="popover"
                  data-bs-trigger="focus"
                  data-bs-html="true"
                  :data-bs-title="actionConfigs[action.actionType].name"
                  :data-bs-content="generateActionPopoverContent(player!, actionConfigs[action.actionType])"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <span>{{ actionConfigs[action.actionType].name }}</span>
                    <span :class="'badge bg-' + Rarity[actionConfigs[action.actionType].rarity]">{{ action.weight.toFixed(2) }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 装备栏区域 -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h4 class="card-title">{{ player.name }} 的装备</h4>
          </div>
          <div class="card-body">
            <div class="list-group">
              <div v-for="[position, equipment] in equipmentEntries" :key="position" class="list-group-item">
                <div class="d-flex align-items-center gap-2">
                  <span class="fw-bold">{{ equipmentPositionMap[position] || position }}</span>
                  <span
                    v-if="equipment"
                    :class="'badge bg-' + Rarity[equipment.rarity]"
                    style="cursor: pointer"
                    @click="removeEquipment(position)"
                  >
                    {{ equipment.getName() }}
                  </span>
                  <span v-else class="badge bg-secondary">空</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 背包区域 -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-secondary text-white">
            <h4 class="card-title mb-0">{{ player.name }} 的背包</h4>
          </div>
          <div class="card-body">
            <!-- Tab 导航 -->
            <ul class="nav nav-underline mb-3">
              <li class="nav-item">
                <button class="nav-link" :class="{ active: packTab === 'all' }" @click="packTab = 'all'">全部</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: packTab === 'equip' }" @click="packTab = 'equip'">装备</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: packTab === 'consumable' }" @click="packTab = 'consumable'">消耗品</button>
              </li>
            </ul>
            <div class="d-flex flex-wrap gap-2">
              <template v-for="item in filteredPack" :key="item.uuid">
                <button :class="'btn btn-' + Rarity[item.rarity]" :ref="(el) => setItemRef(item.uuid, el as HTMLElement)">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="item.getItemIcon()"></span>{{ item.getName() }}
                </button>
              </template>
              <p v-if="filteredPack.length === 0" class="text-muted">
                {{ packTab === "all" ? "背包为空" : packTab === "equip" ? "没有装备" : "没有道具" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 宠物区域 -->
      <div class="row mb-4">
        <div class="col">
          <div class="card">
            <div class="card-header bg-secondary text-white">
              <h4 class="card-title">{{ player.name }} 的宠物</h4>
            </div>
            <div class="card-body">
              <div class="list-group">
                <template v-if="player.capturedMonster.length > 0">
                  <div
                    v-for="monster in player.capturedMonster"
                    :key="monster.name"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span class="fw-bold">{{ monster.name }}</span>
                    <span class="text-muted">Lv. {{ monster.level }}</span>
                  </div>
                </template>
                <p v-else class="text-muted">暂无宠物</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 返回主菜单按钮 -->
      <div class="text-center">
        <button class="btn btn-primary" @click="router.push({ name: 'main-menu' })">返回主菜单</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { Rarity } from "@/types";
import type { Ability } from "@/creatures/types";
import { actionConfigs } from "@/actions/actionConfigs";
import { generateItemTooltipContent } from "@/items/itemUtils";
import { generateActionPopoverContent } from "@/actions/actionUtils";
import { EquipmentPosition } from "@/items/types";
import { Consumable } from "@/items/Consumable";
import { Equipment } from "@/items/Equipment";
import tippy, { Instance as TippyInstance } from "tippy.js";
import "tippy.js/dist/tippy.css";
import * as bootstrap from "bootstrap";
const router = useRouter();
const playerStore = usePlayerStore();

const player = computed(() => playerStore.player);
const actionTab = ref<"extra" | "base">("extra");
const packTab = ref<"all" | "equip" | "consumable">("all");
const renderKey = ref(0);

// tippy 实例管理
const tippyInstances: TippyInstance[] = [];
const itemRefs = new Map<string, HTMLElement>();

const attributeNameMap: Record<string, string> = {
  str: "力量",
  dex: "敏捷",
  con: "体质",
  int: "智力",
  siz: "体型",
  app: "魅力",
  armor: "护甲",
  piercing: "穿刺",
};

const attributeDescMap: Record<string, string> = {
  str: "影响具有力量系数的动作。大部分的攻击动作都具有力量系数。",
  dex: "影响具有敏捷系数的动作，一部分迅捷的攻击动作，以及大部分闪避动作都具有敏捷系数。",
  con: "影响具有体质系数的动作，同时影响生命值上限和自然回复生命值的速度。",
  int: "影响具有智力系数的动作。",
  siz: "影响具有体型系数的动作。",
  app: "暂时没用",
  armor: "护甲值决定对伤害的减免程度。",
  piercing: "穿刺值决定攻击时无视目标护甲的能力。",
};

const equipmentPositionMap: Record<string, string> = {
  body: "防具",
  hand: "武器",
  foot: "鞋子",
  accessory: "饰品",
};

const nonPlusableAttributes = ["armor", "piercing"];

const abilityEntries = computed(() => {
  renderKey.value; // dependency
  if (!player.value) return [];
  return Object.entries(player.value.getAbility());
});

const equipmentEntries = computed(() => {
  renderKey.value;
  if (!player.value) return [];
  return Object.entries(player.value.equipments);
});

function getExtraAbilityValue(attr: string): number {
  if (!player.value) return 0;
  return player.value.getExtraAbility()[attr as keyof Ability] || 0;
}

function getPlusAbilityValue(attr: string): number {
  if (!player.value) return 0;
  return player.value.plusAbility[attr as keyof Ability] || 0;
}

const sortedExtraActions = computed(() => {
  renderKey.value;
  if (!player.value) return [];
  return [...player.value.getExtraActions()].sort(
    (a, b) => actionConfigs[b.actionType].rarity - actionConfigs[a.actionType].rarity,
  );
});

const sortedBaseActions = computed(() => {
  renderKey.value;
  if (!player.value) return [];
  return [...player.value.actions].sort(
    (a, b) => actionConfigs[b.actionType].rarity - actionConfigs[a.actionType].rarity,
  );
});

const filteredPack = computed(() => {
  renderKey.value;
  if (!player.value) return [];
  let items = [...player.value.pack];
  if (packTab.value === "equip") {
    items = items.filter((item) => item instanceof Equipment);
  } else if (packTab.value === "consumable") {
    items = items.filter((item) => item instanceof Consumable);
  }
  return items.sort((a, b) => b.rarity - a.rarity);
});

function setItemRef(uuid: string, el: HTMLElement | null) {
  if (el) {
    itemRefs.set(uuid, el);
  } else {
    itemRefs.delete(uuid);
  }
}

function destroyTippyInstances() {
  tippyInstances.forEach((instance) => instance.destroy());
  tippyInstances.length = 0;
}

function initTippyInstances() {
  destroyTippyInstances();
  if (!player.value) return;

  // 为背包物品创建 tippy
  for (const item of filteredPack.value) {
    const el = itemRefs.get(item.uuid);
    if (!el) continue;

    const tooltipContent = generateItemTooltipContent(item);
    const isConsumable = item instanceof Consumable;

    const instance = tippy(el, {
      theme: "game",
      content: `
        ${tooltipContent}
        <button class="use-item-btn btn btn-success btn-sm mt-1">${isConsumable ? "使用" : "装备"}</button>
        <button class="discard-item-btn btn btn-danger btn-sm mt-1">丢弃</button>
      `,
      allowHTML: true,
      interactive: true,
      trigger: "click",
      hideOnClick: true,
      appendTo: document.body,
      onShown(inst) {
        const useBtn = inst.popper.querySelector(".use-item-btn");
        const discardBtn = inst.popper.querySelector(".discard-item-btn");

        useBtn?.addEventListener("click", (e) => {
          e.stopPropagation();
          inst.hide();
          if (item instanceof Consumable) {
            item.useItem(player.value!);
            player.value!.addLog(`${player.value!.name} 使用了 ${item.getName()}`);
          } else if (item instanceof Equipment) {
            player.value!.wearEquipment(item);
          }
          playerStore.save();
          refreshPage();
        });

        discardBtn?.addEventListener("click", (e) => {
          e.stopPropagation();
          inst.hide();
          player.value!.discardItem(item);
          playerStore.save();
          refreshPage();
        });
      },
    });

    tippyInstances.push(instance);
  }

  // 为装备栏创建 tippy
  if (player.value) {
    for (const [position, equipment] of Object.entries(player.value.equipments)) {
      if (!equipment) continue;
      const tooltipContent = generateItemTooltipContent(equipment);
      const el = document.querySelector(`[data-equip-pos="${position}"]`) as HTMLElement;
      if (!el) continue;

      const instance = tippy(el, {
        theme: "game",
        content: `
          ${tooltipContent}
          <button class="remove-equip-btn btn btn-primary btn-sm mt-1">卸下</button>
        `,
        allowHTML: true,
        interactive: true,
        trigger: "click",
        hideOnClick: true,
        appendTo: document.body,
        onShown(inst) {
          const btn = inst.popper.querySelector(".remove-equip-btn");
          btn?.addEventListener("click", (e) => {
            e.stopPropagation();
            inst.hide();
            player.value!.removeEquipment(position as EquipmentPosition);
            playerStore.save();
            refreshPage();
          });
        },
      });

      tippyInstances.push(instance);
    }
  }

  // 为属性添加 tippy 提示
  const attrElements = document.querySelectorAll("#attribute-bar .list-group-item");
  attrElements.forEach((el) => {
    const attrName = (el as HTMLElement).dataset.attr;
    if (!attrName) return;
    const description = attributeDescMap[attrName] || "暂无描述";

    const instance = tippy(el as HTMLElement, {
      content: `<div class="p-2">${description}</div>`,
      allowHTML: true,
      theme: "game",
      placement: "top",
    });

    tippyInstances.push(instance);
  });
}

function initPopovers() {
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => {
    new bootstrap.Popover(el);
  });
}

function refreshPage() {
  renderKey.value++;
  playerStore.triggerUpdate();
  nextTick(() => {
    initTippyInstances();
    initPopovers();
  });
}

function plusAttribute(attr: string) {
  if (!player.value || player.value.plusAbilityPoint <= 0 || nonPlusableAttributes.includes(attr)) return;

  player.value.plusAbilityPoint--;
  (player.value.plusAbility as unknown as Record<string, number>)[attr]++;

  if (attr === "con" || attr === "siz") {
    const oldMaxHealth = player.value.getMaxHealth();
    const newMaxHealth = player.value.getAbility().con * 10 + player.value.getAbility().siz * 5;
    player.value.recoverHp(newMaxHealth - oldMaxHealth);
  }

  playerStore.save();
  refreshPage();
}

function removeEquipment(position: string) {
  if (!player.value) return;
  const equipment = player.value.equipments[position as EquipmentPosition];
  if (!equipment) return;

  if (confirm(`卸下 ${equipment.getName()}？`)) {
    player.value.removeEquipment(position as EquipmentPosition);
    playerStore.save();
    refreshPage();
  }
}

// 监听 tab 切换，重新初始化 tippy
watch([actionTab, packTab], () => {
  nextTick(() => {
    initTippyInstances();
    initPopovers();
  });
});

onMounted(async () => {
  await nextTick();
  initTippyInstances();
  initPopovers();
});

onBeforeUnmount(() => {
  destroyTippyInstances();
});
</script>

<style scoped>
@keyframes attribute-plus-animation {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

.attribute-plus-animation {
  animation: attribute-plus-animation 0.5s ease-out;
}
</style>
