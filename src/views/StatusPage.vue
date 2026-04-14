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
              <div class="action-list">
                <div
                  v-for="action in sortedExtraActions"
                  :key="action.actionType"
                  class="action-item"
                  :class="'action-item-' + Rarity[actionConfigs[action.actionType].rarity]"
                  tabindex="0"
                  data-bs-toggle="popover"
                  data-bs-trigger="focus"
                  data-bs-html="true"
                  :data-bs-title="actionConfigs[action.actionType].name"
                  :data-bs-content="generateActionPopoverContent(player!, actionConfigs[action.actionType])"
                >
                  <div class="action-item-main">
                    <span class="action-icons">{{ getActionIcons(actionConfigs[action.actionType]) }}</span>
                    <span class="action-name">{{ actionConfigs[action.actionType].name }}</span>
                  </div>
                  <span :class="'badge bg-' + Rarity[actionConfigs[action.actionType].rarity]">{{ action.weight.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            <!-- 基础行动列表 -->
            <div v-else>
              <div class="action-list">
                <div
                  v-for="action in sortedBaseActions"
                  :key="action.actionType"
                  class="action-item"
                  :class="'action-item-' + Rarity[actionConfigs[action.actionType].rarity]"
                  tabindex="0"
                  data-bs-toggle="popover"
                  data-bs-trigger="focus"
                  data-bs-html="true"
                  :data-bs-title="actionConfigs[action.actionType].name"
                  :data-bs-content="generateActionPopoverContent(player!, actionConfigs[action.actionType])"
                >
                  <div class="action-item-main">
                    <span class="action-icons">{{ getActionIcons(actionConfigs[action.actionType]) }}</span>
                    <span class="action-name">{{ actionConfigs[action.actionType].name }}</span>
                  </div>
                  <span :class="'badge bg-' + Rarity[actionConfigs[action.actionType].rarity]">{{ action.weight.toFixed(2) }}</span>
                </div>
              </div>
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
                    :data-equip-pos="position"
                  >{{ equipment.getName() }}</span>
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
          <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">{{ player.name }} 的背包</h4>
            <button
              class="btn btn-sm"
              :class="forgeMode ? 'btn-danger' : 'btn-warning'"
              @click="toggleForgeMode"
            >
              {{ forgeMode ? "✕ 取消合成" : "⚒️ 合成" }}
            </button>
          </div>
          <div class="card-body">
            <!-- 合成模式提示栏 -->
            <div v-if="forgeMode" class="forge-info-bar mb-3">
              <div class="forge-hint">
                <span>选择 <strong>{{ FORGE_REQUIRED }}</strong> 件装备合成</span>
                <span class="forge-count badge bg-primary ms-2">{{ forgeSelectedCount }} / {{ FORGE_REQUIRED }}</span>
              </div>
              <div v-if="forgePreview && forgeSelectedCount > 0" class="forge-preview mt-2">
                <small class="text-muted">
                  预估: Lv.{{ forgePreview.avgLevel }}
                  <span :class="'text-' + Rarity[Math.round(forgePreview.avgRarity)]">
                    {{ ["普通", "稀有", "杰作", "史诗", "神话"][Math.min(Math.round(forgePreview.avgRarity), 4)] }}
                  </span>
                  宝箱（也许）
                </small>
              </div>
              <button
                v-if="forgeSelectedCount === FORGE_REQUIRED"
                class="btn btn-warning btn-sm mt-2 forge-confirm-btn"
                @click="executeForge"
              >
                ⚒️ 确认合成！
              </button>
            </div>
            <!-- Tab 导航 -->
            <ul v-if="!forgeMode" class="nav nav-underline mb-3">
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
                <button
                  v-if="forgeMode"
                  :class="[
                    'btn btn-' + Rarity[item.rarity],
                    'forge-item',
                    { 'forge-selected': forgeSelected.has(item.uuid), 'forge-disabled': !(item instanceof Equipment) || item.rarity === Rarity.Unique }
                  ]"
                  :disabled="!(item instanceof Equipment) || item.rarity === Rarity.Unique"
                  @click="item instanceof Equipment && item.rarity !== Rarity.Unique && toggleForgeSelect(item)"
                >
                  <span class="forge-check" v-if="forgeSelected.has(item.uuid)">✓</span>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="item.getItemIcon()"></span>{{ item.getName() }}
                </button>
                <button v-else :class="'btn btn-' + Rarity[item.rarity]" :ref="(el) => setItemRef(item.uuid, el as HTMLElement)">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="item.getItemIcon()"></span>{{ item.getName() }}
                </button>
              </template>
              <p v-if="filteredPack.length === 0" class="text-muted">
                {{ forgeMode ? "没有装备可以合成" : packTab === "all" ? "背包为空" : packTab === "equip" ? "没有装备" : "没有道具" }}
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
              <template v-if="player.capturedMonster.length > 0">
                <div class="pet-list">
                  <div
                    v-for="(monster, idx) in player.capturedMonster"
                    :key="idx"
                    class="pet-row"
                    :class="{
                      'pet-active': player.activePetIndex === idx,
                      'pet-fainted': monster.isFainted,
                      'pet-variant-veteran': monster.variant === 'veteran',
                      'pet-variant-mutant': monster.variant === 'mutant',
                    }"
                  >
                    <div class="pet-row-main">
                      <div class="pet-row-info">
                        <div class="pet-row-top">
                          <span class="pet-name">{{ monster.name }}</span>
                          <span class="pet-level">Lv.{{ monster.level }}</span>
                          <span v-if="monster.isFainted" class="pet-fainted-tag">昏迷</span>
                          <span v-if="player.activePetIndex === idx" class="pet-active-tag">出战</span>
                        </div>
                        <div class="pet-row-bars">
                          <div class="pet-hp-bar">
                            <div class="pet-hp-fill" :style="{ width: (monster.health / monster.getMaxHealth() * 100) + '%' }" />
                          </div>
                        </div>
                      </div>
                      <button
                        class="pet-menu-btn"
                        :data-pet-idx="idx"
                      >⋯</button>
                    </div>
                  </div>
                </div>
              </template>
              <p v-else class="text-muted">暂无宠物</p>
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
import { generateActionPopoverContent, getActionIcons } from "@/actions/actionUtils";
import { EquipmentPosition } from "@/items/types";
import { Consumable } from "@/items/Consumable";
import { ConsumableType } from "@/items/consumableConfigs";
import { Equipment } from "@/items/Equipment";
import { showToast } from "@/utils/toast";
import tippy, { Instance as TippyInstance } from "tippy.js";
import "tippy.js/dist/tippy.css";
import * as bootstrap from "bootstrap";
const router = useRouter();
const playerStore = usePlayerStore();

const player = computed(() => playerStore.player);
const actionTab = ref<"extra" | "base">("extra");
const packTab = ref<"all" | "equip" | "consumable">("all");
const renderKey = ref(0);

const forgeMode = ref(false);
const forgeSelected = ref<Set<string>>(new Set());
const FORGE_REQUIRED = 4;

const forgeSelectedCount = computed(() => forgeSelected.value.size);

const forgePreview = computed(() => {
  if (forgeSelected.value.size === 0 || !player.value) return null;
  const items = player.value.pack.filter(
    (item) => item instanceof Equipment && forgeSelected.value.has(item.uuid),
  ) as Equipment[];
  if (items.length === 0) return null;
  const avgLevel = items.reduce((sum, e) => sum + e.level, 0) / items.length;
  const avgRarity = items.reduce((sum, e) => sum + e.rarity, 0) / items.length;
  return { avgLevel: Math.round(avgLevel), avgRarity };
});

const rarityToChest: Record<number, ConsumableType> = {
  [Rarity.Common]: ConsumableType.BrokenChest,
  [Rarity.Rare]: ConsumableType.WoodenChest,
  [Rarity.Masterpiece]: ConsumableType.SilverChest,
  [Rarity.Epic]: ConsumableType.GoldChest,
  [Rarity.Mythical]: ConsumableType.DiamondChest,
};

function toggleForgeMode() {
  forgeMode.value = !forgeMode.value;
  forgeSelected.value = new Set();
  if (forgeMode.value) {
    packTab.value = "all";
  }
  refreshPage();
}

function toggleForgeSelect(item: Equipment) {
  const newSet = new Set(forgeSelected.value);
  if (newSet.has(item.uuid)) {
    newSet.delete(item.uuid);
  } else if (newSet.size < FORGE_REQUIRED) {
    newSet.add(item.uuid);
  }
  forgeSelected.value = newSet;
}

function executeForge() {
  if (!player.value || forgeSelected.value.size !== FORGE_REQUIRED) return;

  const items = player.value.pack.filter(
    (item) => item instanceof Equipment && forgeSelected.value.has(item.uuid),
  ) as Equipment[];
  if (items.length !== FORGE_REQUIRED) return;

  const avgLevel = items.reduce((sum, e) => sum + e.level, 0) / items.length;
  const avgRarity = items.reduce((sum, e) => sum + e.rarity, 0) / items.length;

  const levelVariation = Math.floor((Math.random() - 0.5) * 10);
  let chestLevel = Math.max(0, Math.round(avgLevel) + levelVariation);

  let chestRarity = Math.round(avgRarity);
  const rarityRoll = Math.random();
  if (rarityRoll < 0.1) {
    chestRarity = Math.max(Rarity.Common, chestRarity - 1);
  } else if (rarityRoll > 0.9) {
    chestRarity = Math.min(Rarity.Mythical, chestRarity + 1);
  }
  chestRarity = Math.max(Rarity.Common, Math.min(Rarity.Mythical, chestRarity));

  const chestType = rarityToChest[chestRarity] ?? ConsumableType.BrokenChest;

  player.value.pack = player.value.pack.filter(
    (item) => !forgeSelected.value.has(item.uuid),
  );

  const chest = new Consumable(chestType, chestLevel);
  player.value.pack.push(chest);

  showToast(
    "⚒️ 合成成功",
    `将 ${FORGE_REQUIRED} 件装备合成为 ${chest.getItemIcon()} <strong class="text-${Rarity[chest.rarity]}">${chest.getName()}</strong>（Lv.${chestLevel}）！`,
    { headerClass: "bg-warning text-dark" },
  );

  forgeMode.value = false;
  forgeSelected.value = new Set();
  playerStore.save();
  refreshPage();
}

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
  int: "影响具有智力系数的动作，同时影响成功判断敌人动作的概率。",
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

    const contentEl = document.createElement("div");
    contentEl.innerHTML = `
        ${tooltipContent}
        <button class="use-item-btn btn btn-success btn-sm mt-1">${isConsumable ? "使用" : "装备"}</button>
        <button class="discard-item-btn btn btn-danger btn-sm mt-1">丢弃</button>
    `;
    contentEl.querySelector(".use-item-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (item instanceof Consumable) {
        item.useItem(player.value!);
        player.value!.addLog(`${player.value!.name} 使用了 ${item.getName()}`);
      } else if (item instanceof Equipment) {
        player.value!.wearEquipment(item);
      }
      playerStore.save();
      refreshPage();
    });
    contentEl.querySelector(".discard-item-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      player.value!.discardItem(item);
      playerStore.save();
      refreshPage();
    });

    const instance = tippy(el, {
      theme: "game",
      content: contentEl,
      interactive: true,
      trigger: "click",
      hideOnClick: true,
      appendTo: document.body,
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

      const equipContentEl = document.createElement("div");
      equipContentEl.innerHTML = `
          ${tooltipContent}
          <button class="remove-equip-btn btn btn-primary btn-sm mt-1">卸下</button>
      `;
      equipContentEl.querySelector(".remove-equip-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        player.value!.removeEquipment(position as EquipmentPosition);
        playerStore.save();
        refreshPage();
      });

      const instance = tippy(el, {
        theme: "game",
        content: equipContentEl,
        interactive: true,
        trigger: "click",
        hideOnClick: true,
        appendTo: document.body,
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

function generatePetMenuContent(monster: import("@/creatures/Monster").Monster, idx: number): string {
  const isActive = player.value!.activePetIndex === idx;
  const isFainted = monster.isFainted;
  const toggleLabel = isActive ? "休息" : "出战";
  const toggleClass = isActive ? "btn-outline-secondary" : "btn-outline-primary";
  const toggleDisabled = !isActive && isFainted ? "disabled" : "";

  return `<div class="pet-menu-popup">
    <div class="pet-menu-actions">
      <button class="btn btn-sm ${toggleClass} pet-toggle-btn" data-pet-toggle="${idx}" ${toggleDisabled}>${toggleLabel}</button>
      <button class="btn btn-sm btn-outline-danger pet-release-btn" data-pet-release="${idx}">放生</button>
    </div>
    <hr style="margin:6px 0;opacity:0.15">
    ${generatePetTooltipContent(monster)}
  </div>`;
}

function initPetDetailTippys() {
  if (!player.value) return;
  document.querySelectorAll(".pet-menu-btn").forEach((el) => {
    const idx = parseInt((el as HTMLElement).dataset.petIdx || "-1", 10);
    if (idx < 0 || idx >= player.value!.capturedMonster.length) return;
    const monster = player.value!.capturedMonster[idx] as import("@/creatures/Monster").Monster;
    const instance = tippy(el as HTMLElement, {
      content: generatePetMenuContent(monster, idx),
      allowHTML: true,
      theme: "game",
      placement: "bottom-end",
      trigger: "click",
      interactive: true,
      appendTo: document.body,
      maxWidth: 320,
      onShown(inst) {
        const toggleBtn = inst.popper.querySelector(".pet-toggle-btn");
        toggleBtn?.addEventListener("click", () => {
          const isActive = player.value!.activePetIndex === idx;
          setActivePet(isActive ? -1 : idx);
          inst.hide();
        });
        const releaseBtn = inst.popper.querySelector(".pet-release-btn");
        releaseBtn?.addEventListener("click", () => {
          inst.hide();
          releasePet(idx);
        });
      },
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
    initPetDetailTippys();
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

function generatePetTooltipContent(monster: import("@/creatures/Monster").Monster): string {
  const ab = monster.getAbility();
  const stats = [
    `<span class="pet-tip-stat">力量 <b>${Math.round(ab.str)}</b></span>`,
    `<span class="pet-tip-stat">敏捷 <b>${Math.round(ab.dex)}</b></span>`,
    `<span class="pet-tip-stat">体质 <b>${Math.round(ab.con)}</b></span>`,
    `<span class="pet-tip-stat">智力 <b>${Math.round(ab.int)}</b></span>`,
    `<span class="pet-tip-stat">体型 <b>${Math.round(ab.siz)}</b></span>`,
    `<span class="pet-tip-stat">魅力 <b>${Math.round(ab.app)}</b></span>`,
    `<span class="pet-tip-stat">护甲 <b>${Math.round(ab.armor)}</b></span>`,
    `<span class="pet-tip-stat">穿透 <b>${Math.round(ab.piercing)}</b></span>`,
  ].join("");

  const actions = monster.getActions();
  const actionsHtml = actions.map((wa) => {
    const cfg = actionConfigs[wa.actionType];
    return `<div class="pet-tip-action">${cfg.name} <span class="pet-tip-weight">${wa.weight.toFixed(2)}</span></div>`;
  }).join("");

  const expPct = Math.min(100, (monster.exp / monster.getNextLevelExp()) * 100);
  const expText = `${Math.floor(monster.exp)}/${monster.getNextLevelExp()}`;

  return `<div class="pet-tip-card">
    <div class="pet-tip-header">
      <span class="pet-tip-name">${monster.name}</span>
      <span class="pet-tip-lv">Lv.${monster.level}</span>
    </div>
    <div class="pet-tip-exp-bar-wrap">
      <span class="pet-tip-exp-label">EXP</span>
      <div class="pet-tip-exp-track">
        <div class="pet-tip-exp-fill" style="width:${expPct}%"></div>
      </div>
      <span class="pet-tip-exp-text">${expText}</span>
    </div>
    <div class="pet-tip-section-title">属性</div>
    <div class="pet-tip-stats">${stats}</div>
    <div class="pet-tip-section-title">行动列表</div>
    <div class="pet-tip-actions">${actionsHtml}</div>
  </div>`;
}

function setActivePet(idx: number) {
  if (!player.value) return;
  player.value.activePetIndex = idx;
  playerStore.save();
  refreshPage();
}

function releasePet(idx: number) {
  if (!player.value) return;
  const pet = player.value.capturedMonster[idx];
  if (!confirm(`确定要放生 ${pet.name} 吗？放生后无法找回。`)) return;
  player.value.capturedMonster.splice(idx, 1);
  if (player.value.activePetIndex === idx) {
    player.value.activePetIndex = -1;
  } else if (player.value.activePetIndex > idx) {
    player.value.activePetIndex--;
  }
  playerStore.save();
  refreshPage();
}

// 监听 tab 切换，重新初始化 tippy
watch([actionTab, packTab], () => {
  nextTick(() => {
    initTippyInstances();
    initPopovers();
    initPetDetailTippys();
  });
});

onMounted(async () => {
  await nextTick();
  initTippyInstances();
  initPopovers();
  initPetDetailTippys();
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

.forge-info-bar {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 10px 14px;
  text-align: center;
}

.forge-hint {
  font-size: 14px;
}

.forge-count {
  font-size: 13px;
}

.forge-preview {
  font-size: 13px;
}

.forge-confirm-btn {
  font-weight: bold;
  animation: forge-pulse 1.5s infinite;
}

@keyframes forge-pulse {
  0%, 100% { box-shadow: 0 0 4px rgba(255, 193, 7, 0.4); }
  50% { box-shadow: 0 0 12px rgba(255, 193, 7, 0.8); }
}

.forge-item {
  position: relative;
  transition: transform 0.15s, box-shadow 0.15s;
}

.forge-item.forge-selected {
  transform: scale(1.05);
  box-shadow: 0 0 0 3px #ffc107, 0 0 10px rgba(255, 193, 7, 0.5);
}

.forge-item.forge-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.forge-check {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ffc107;
  color: #000;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  font-weight: bold;
  line-height: 18px;
  text-align: center;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #6c757d;
  background: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.15s, box-shadow 0.15s;
}

.action-item:hover {
  background: #e9ecef;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.action-item:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
}

.action-item-Common { border-left-color: #6c757d; }
.action-item-Rare { border-left-color: #388e3c; }
.action-item-Masterpiece { border-left-color: #0288d1; }
.action-item-Epic { border-left-color: #ff9800; }
.action-item-Mythical { border-left-color: #d63384; }
.action-item-Unique { border-left-color: #dc3545; }

.action-item-main {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.action-icons {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.action-name {
  font-weight: 600;
  font-size: 14px;
  color: #212529;
}

</style>
