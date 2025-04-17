import { Player } from "../creatures/Player";
import { saveGame } from "../save";
import { Consumable } from "../items/Consumable";
import { Equipment } from "../items/Equipment";
import { renderMainMenu } from "./mainMenu";
import { Rarity } from "../types";
import { Ability } from "../creatures/types";
import { actionConfigs } from "../actions/actionConfigs";
import { generateItemTooltipContent, getItemIcon } from "../items/itemUtils";
import { getAppElement } from "./utils";
import { generateActionPopoverContent } from "../actions/actionUtils";
import { EquipmentPosition } from "../items/types";
import tippy, { Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import * as bootstrap from "bootstrap";

// 存储物品UUID到tippy实例的映射，防止重复创建
const itemTippyInstances: Map<string, TippyInstance[]> = new Map();
// 存储属性tippy实例的映射
const attributeTippyInstances: TippyInstance[] = [];

// 添加属性名称中英文映射
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

// 添加属性描述映射
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

// 添加装备位置中英文映射
const equipmentPositionMap: Record<string, string> = {
  body: "防具",
  hand: "武器",
  foot: "鞋子",
  accessory: "饰品",
};

// 不能加点的属性列表
const nonPlusableAttributes = ["armor", "piercing"];

// 添加动画样式到页面
function addAnimationStyles() {
  // 检查是否已经添加了样式
  if (document.getElementById('game-animation-styles')) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = 'game-animation-styles';
  styleEl.textContent = `
    @keyframes attribute-plus-animation {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 1; }
      100% { transform: scale(1); opacity: 0.8; }
    }

    .attribute-plus-animation {
      animation: attribute-plus-animation 0.5s ease-out;
    }

    @keyframes point-spent-animation {
      0% { opacity: 0; transform: translateY(10px); }
      50% { opacity: 1; transform: translateY(-5px); }
      100% { opacity: 0; transform: translateY(-20px); }
    }

    .point-spent-indicator {
      position: absolute;
      color: #0dcaf0;
      font-weight: bold;
      font-size: 1.2em;
      pointer-events: none;
      z-index: 100;
      animation: point-spent-animation 1s ease-out forwards;
    }
  `;
  document.head.appendChild(styleEl);
}

// 渲染状态界面
export function renderStatusPage(player: Player): void {
  // 添加动画样式
  addAnimationStyles();

  // 清除所有现有的tippy实例
  itemTippyInstances.forEach(instances => {
    instances.forEach(instance => instance.destroy());
  });
  itemTippyInstances.clear();

  // 清除属性tippy实例
  attributeTippyInstances.forEach(instance => instance.destroy());
  attributeTippyInstances.length = 0;

  const appElement = getAppElement();

  appElement.innerHTML = `
    <div class="container mt-4">
      <h2 class="text-center mb-4">状态</h2>

      <div class="row">
        <!-- 属性栏区域 -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">${player.name} 的属性</h4>
              <div>
                <span class="badge bg-primary">可用加点: <span id="available-points">${player.plusAbilityPoint}</span></span>
              </div>
            </div>
            <div class="card-body">
              <div id="attribute-bar" class="list-group list-group-flush">
                ${(() => {
                  const baseAbilities = player.getAbility();
                  const extraAbilities = player.getExtraAbility();
                  return Object.entries(baseAbilities).map(([attribute, value]) => {
                    const extra = extraAbilities[attribute as keyof Ability] || 0;
                    const plusValue = player.plusAbility[attribute as keyof Ability] || 0;
                    let extraBadge = '';

                    // 显示装备加成
                    if (extra > 0) {
                      extraBadge = `<span class="badge bg-success ms-1">+${extra}</span>`;
                    } else if (extra < 0) {
                      extraBadge = `<span class="badge bg-danger ms-1">${extra}</span>`;
                    }

                    // 显示加点加成
                    let plusBadge = '';
                    if (plusValue > 0) {
                      plusBadge = `<span class="badge bg-info ms-1">+${plusValue}</span>`;
                    }

                    // 添加加点按钮，非护甲和穿刺属性，只有当有可用加点时才显示
                    const plusButton = (!nonPlusableAttributes.includes(attribute) && player.plusAbilityPoint > 0)
                      ? `<button class="btn btn-sm btn-outline-primary plus-btn" data-attribute="${attribute}">+</button>`
                      : '';

                    return `
                      <div class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="fw-bold">${attributeNameMap[attribute] || attribute}</span>
                        <div class="d-flex align-items-center">
                          <span class="text-muted me-2">${value}</span>
                          ${extraBadge}
                          ${plusBadge}
                          ${plusButton}
                        </div>
                      </div>
                    `;
                  }).join("");
                })()}
              </div>
            </div>
          </div>
        </div>

        <!-- 行动列表区域 -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-secondary text-white">
              <h4 class="card-title mb-0">${player.name} 的行动列表</h4>
            </div>
            <div class="card-body">
              <!-- Tab 导航 -->
              <ul class="nav nav-underline mb-3" id="actionTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="extra-tab" data-bs-toggle="tab" data-bs-target="#extra-actions" type="button" role="tab" aria-controls="extra-actions" aria-selected="true">
                    装备额外行动
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="base-tab" data-bs-toggle="tab" data-bs-target="#base-actions" type="button" role="tab" aria-controls="base-actions" aria-selected="false">
                    基础行动
                  </button>
                </li>
              </ul>
              <!-- Tab 内容 -->
              <div class="tab-content" id="actionTabContent">
                <!-- 装备额外行动列表（默认激活） -->
                <div class="tab-pane fade show active" id="extra-actions" role="tabpanel" aria-labelledby="extra-tab">
                  <ul class="list-group">
                    ${player.getExtraActions()
                      .sort((a, b) => actionConfigs[b.actionType].rarity - actionConfigs[a.actionType].rarity)
                      .map(action => `
                        <li class="list-group-item" tabindex="0"
                            data-bs-toggle="popover"
                            data-bs-trigger="focus"
                            data-bs-html="true"
                            data-bs-title="${actionConfigs[action.actionType].name}"
                            data-bs-content='
                              <div>
                                ${generateActionPopoverContent(player, actionConfigs[action.actionType])}
                              </div>
                            '>
                          <div class="d-flex justify-content-between align-items-center">
                            <span>${actionConfigs[action.actionType].name}</span>
                            <span class="badge bg-${Rarity[actionConfigs[action.actionType].rarity]}">
                              ${action.weight.toFixed(2)}
                            </span>
                          </div>
                        </li>
                      `).join("")}
                  </ul>
                </div>
                <!-- 基础行动列表 -->
                <div class="tab-pane fade" id="base-actions" role="tabpanel" aria-labelledby="base-tab">
                  <ul class="list-group">
                    ${player.actions
                      .sort((a, b) => actionConfigs[b.actionType].rarity - actionConfigs[a.actionType].rarity)
                      .map(action => `
                        <li class="list-group-item" tabindex="0"
                            data-bs-toggle="popover"
                            data-bs-trigger="focus"
                            data-bs-html="true"
                            data-bs-title="${actionConfigs[action.actionType].name}"
                            data-bs-content='
                              <div>
                                ${generateActionPopoverContent(player, actionConfigs[action.actionType])}
                              </div>
                            '>
                          <div class="d-flex justify-content-between align-items-center">
                            <span>${actionConfigs[action.actionType].name}</span>
                            <span class="badge bg-${Rarity[actionConfigs[action.actionType].rarity]}">
                              ${action.weight.toFixed(2)}
                            </span>
                          </div>
                        </li>
                      `).join("")}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 装备栏区域 -->
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header bg-secondary text-white">
              <h4 class="card-title">${player.name} 的装备</h4>
            </div>
            <div class="card-body">
              <div id="equipment-bar" class="list-group">
                ${Object.entries(player.equipments)
                  .map(
                    ([position, equipment]) => `
                  <div id="equipment-slot-${position}" class="list-group-item">
                    <div class="d-flex align-items-center gap-2">
                      <span class="fw-bold">${equipmentPositionMap[position] || position}</span>
                      ${
                        equipment
                            ? `<span id="equipment-slot-${position}" class="badge bg-${Rarity[equipment.rarity]}">${equipment.name}</span>`
                            : '<span class="badge bg-secondary">空</span>'
                      }
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>

      <!-- 背包区域 -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-secondary text-white">
            <h4 class="card-title mb-0">${player.name} 的背包</h4>
          </div>
          <div class="card-body">
            <!-- Tab 导航 -->
            <ul class="nav nav-underline mb-3" id="packTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" type="button" role="tab" aria-controls="all" aria-selected="true">
                  全部
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="equip-tab" data-bs-toggle="tab" data-bs-target="#equip" type="button" role="tab" aria-controls="equip" aria-selected="false">
                  装备
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="consumable-tab" data-bs-toggle="tab" data-bs-target="#consumable" type="button" role="tab" aria-controls="consumable" aria-selected="false">
                  消耗品
                </button>
              </li>
            </ul>
            <!-- Tab 内容 -->
            <div class="tab-content" id="packTabContent">
              <!-- 全部标签 -->
              <div class="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
                <div id="pack-all" class="d-flex flex-wrap gap-2">
                  ${
                    player.pack.length > 0
                      ? player.pack
                          .sort((a, b) => b.rarity - a.rarity)
                          .map((item) => {
                            const btnClass = `btn-${Rarity[item.rarity]}`;
                            return `<button id="use-btn${item.uuid}" class="btn ${btnClass}">
                              ${getItemIcon(item)}${item.name}
                            </button>`;
                          })
                          .join("")
                      : '<p class="text-muted">背包为空</p>'
                  }
                </div>
              </div>
              <!-- 装备标签 -->
              <div class="tab-pane fade" id="equip" role="tabpanel" aria-labelledby="equip-tab">
                <div id="pack-equip" class="d-flex flex-wrap gap-2">
                  ${
                    player.pack.filter(item => item instanceof Equipment).length > 0
                      ? player.pack
                          .filter(item => item instanceof Equipment)
                          .sort((a, b) => b.rarity - a.rarity)
                          .map((item) => {
                            const btnClass = `btn-${Rarity[item.rarity]}`;
                            return `<button id="use-btn${item.uuid}" class="btn ${btnClass}">
                              ${getItemIcon(item)}${item.name}
                            </button>`;
                          })
                          .join("")
                      : '<p class="text-muted">没有装备</p>'
                  }
                </div>
              </div>
              <!-- 道具标签 -->
              <div class="tab-pane fade" id="consumable" role="tabpanel" aria-labelledby="consumable-tab">
                <div id="pack-consumable" class="d-flex flex-wrap gap-2">
                  ${
                    player.pack.filter(item => item instanceof Consumable).length > 0
                      ? player.pack
                          .filter(item => item instanceof Consumable)
                          .sort((a, b) => b.rarity - a.rarity)
                          .map((item) => {
                            const btnClass = `btn-${Rarity[item.rarity]}`;
                            return `<button id="use-btn${item.uuid}" class="btn ${btnClass}">
                              ${getItemIcon(item)}${item.name}
                            </button>`;
                          })
                          .join("")
                      : '<p class="text-muted">没有道具</p>'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 宠物区域 -->
      <div class="row mb-4">
        <div class="col">
          <div class="card">
            <div class="card-header bg-secondary text-white">
              <h4 class="card-title">${player.name} 的宠物</h4>
            </div>
            <div class="card-body">
              <div id="pet" class="list-group">
                ${
                  player.capturedMonster.length > 0
                    ? player.capturedMonster
                        .map(
                          (monster) => `
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                          <span class="fw-bold">${monster.name}</span>
                          <span class="text-muted">Lv. ${monster.level}</span>
                        </div>
                      `
                        )
                        .join("")
                    : '<p class="text-muted">暂无宠物</p>'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 返回主菜单按钮 -->
      <div class="text-center">
        <button id="back-btn" class="btn btn-primary">返回主菜单</button>
      </div>
    </div>
  `;

  document.getElementById("back-btn")?.addEventListener("click", () => {
    renderMainMenu(player);
  });

  // 为属性加点按钮添加事件监听
  document.querySelectorAll(".plus-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const attributeName = (e.currentTarget as HTMLElement).getAttribute("data-attribute") as keyof Ability;
      const btnElement = e.currentTarget as HTMLElement;

      if (player.plusAbilityPoint > 0 && !nonPlusableAttributes.includes(attributeName)) {
        // 显示动画效果
        btnElement.classList.add('attribute-plus-animation');
        setTimeout(() => {
          btnElement.classList.remove('attribute-plus-animation');
        }, 500);

        // 创建浮动文字
        const indicator = document.createElement('div');
        indicator.className = 'point-spent-indicator';
        indicator.textContent = `+1 ${attributeNameMap[attributeName]}`;

        // 计算指示器位置
        const rect = btnElement.getBoundingClientRect();
        indicator.style.left = `${rect.left}px`;
        indicator.style.top = `${rect.top}px`;

        // 添加到body以确保z-index正常工作
        document.body.appendChild(indicator);

        // 动画结束后移除
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
          }
        }, 1000);

        player.plusAbilityPoint--;
        player.plusAbility[attributeName]++;

        // 如果加点会影响生命值上限，则恢复血量
        if (attributeName === "con" || attributeName === "siz") {
          const oldMaxHealth = player.getMaxHealth();
          // 计算得到新的最大生命值
          const newMaxHealth = player.getAbility().con * 10 + player.getAbility().siz * 5;
          player.recoverHp(newMaxHealth - oldMaxHealth);
        }

        saveGame(player);
        renderStatusPage(player);
      }
    });
  });

  // 为背包中的道具绑定点击事件
  for (const item of player.pack) {
    const tooltipContent = generateItemTooltipContent(item);

    // 查找所有tab中可能存在的该物品按钮
    // 在全部、装备和消耗品三个tab中都可能有相同id的按钮
    const btns = document.querySelectorAll(`[id="use-btn${item.uuid}"]`);

    const instances: TippyInstance[] = [];
    itemTippyInstances.set(item.uuid, instances);

    btns.forEach(btn => {
      const instance = tippy(btn, {
        theme: 'game',
        content: `
          ${tooltipContent}
          <button id="use-btn${item.uuid}" class="btn btn-success">
            ${item instanceof Consumable ? '使用' : '装备'}
          </button>
          <button id="discard-btn${item.uuid}" class="btn btn-danger">
            丢弃
          </button>
        `,
        allowHTML: true,
        interactive: true,      // 允许点击 popover 内部而不消失
        trigger: 'click',       // 点击触发
        hideOnClick: true,      // 点击外部自动隐藏
        appendTo: document.body, // 将 tippy 插入 body
        onShown(instance) {
          // 在弹出后获取 popover 内部的按钮
          const button = instance.popper.querySelector(`#use-btn${item.uuid}`);
          if (button) {
            button.addEventListener("click", (e) => {
              e.stopPropagation(); // 防止点击传播关闭 popover
              instance.hide();
              if (item instanceof Consumable) {
                item.useItem(player);
                player.addLog(`${player.name} 使用了 ${item.name}`);
                saveGame(player);
                renderStatusPage(player);
              } else if (item instanceof Equipment) {
                player.wearEquipment(item);
                saveGame(player);
                renderStatusPage(player);
              }
            });
          }
          const discardButton = instance.popper.querySelector(`#discard-btn${item.uuid}`);
          if (discardButton) {
            discardButton.addEventListener("click", (e) => {
              e.stopPropagation(); // 防止点击传播关闭 popover
              instance.hide();
              player.discardItem(item);
              saveGame(player);
              renderStatusPage(player);
            });
          }
        }
      });

      instances.push(instance);
    });
  }

  // 为装备栏中的装备绑定点击事件（点击时卸下装备）
  for (const [position, equipment] of Object.entries(player.equipments)) {
    if (!equipment) continue;
    const tooltipContent = generateItemTooltipContent(equipment);
    const btn = document.getElementById(`equipment-slot-${position}`);
    if (!btn) continue;

    tippy(btn, {
      theme: 'game',
      content: `
        ${tooltipContent}
        <button id="remove-btn${equipment.uuid}" class="btn btn-primary">
          卸下
        </button>
      `,
      allowHTML: true,
      interactive: true,      // 允许点击 popover 内部而不消失
      trigger: 'click',       // 点击触发
      hideOnClick: true,      // 点击外部自动隐藏
      appendTo: document.body, // 将 tippy 插入 body
      onShown(instance) {
        // 在弹出后获取 popover 内部的按钮
        const button = instance.popper.querySelector(`#remove-btn${equipment.uuid}`);
        if (button) {
          button.addEventListener("click", (e) => {
            e.stopPropagation(); // 防止点击传播关闭 popover
            instance.hide();
            player.removeEquipment(position as EquipmentPosition);
            saveGame(player);
            renderStatusPage(player);
          });
        }
      }
    });
  }

  // 为属性添加tippy提示
  setTimeout(() => {
    const attributeElements = document.querySelectorAll('#attribute-bar .list-group-item');
    attributeElements.forEach(element => {
      const attributeNameElement = element.querySelector('.fw-bold');
      if (!attributeNameElement) return;

      const attributeName = attributeNameElement.textContent?.trim() || '';
      // 查找对应的英文属性名
      const englishAttrName = Object.keys(attributeNameMap).find(
        key => attributeNameMap[key] === attributeName
      ) || attributeName;

      const description = attributeDescMap[englishAttrName] || '暂无描述';

      const instance = tippy(element, {
        content: `<div class="p-2">${description}</div>`,
        allowHTML: true,
        theme: 'game',
        placement: 'top',
        interactive: true,      // 允许点击 popover 内部而不消失
        trigger: 'click',       // 点击触发
        hideOnClick: true,      // 点击外部自动隐藏
      });

      attributeTippyInstances.push(instance);
    });
  }, 100); // 短暂延迟确保DOM已经渲染

  // 初始化所有Bootstrap popover
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach(popoverTrigger => {
    new bootstrap.Popover(popoverTrigger);
  });
}
