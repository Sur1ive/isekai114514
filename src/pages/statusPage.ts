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
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// 渲染状态界面
export function renderStatusPage(player: Player): void {
  const appElement = getAppElement();

  appElement.innerHTML = `
    <div class="container mt-4">
      <h2 class="text-center mb-4">状态</h2>

      <div class="row">
        <!-- 属性栏区域 -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-secondary text-white">
              <h4 class="card-title mb-0">${player.name} 的属性</h4>
            </div>
            <div class="card-body">
              <div id="attribute-bar" class="list-group list-group-flush">
                ${(() => {
                  const baseAbilities = player.getAbility();
                  const extraAbilities = player.getExtraAbility();
                  return Object.entries(baseAbilities).map(([attribute, value]) => {
                    const extra = extraAbilities[attribute as keyof Ability] || 0;
                    let extraBadge = '';
                    if (extra > 0) {
                      extraBadge = `<span class="badge bg-success ms-2">+${extra}</span>`;
                    } else if (extra < 0) {
                      extraBadge = `<span class="badge bg-danger ms-2">${extra}</span>`;
                    }
                    return `
                      <div class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-capitalize">${attribute}</span>
                        <div>
                          <span class="text-muted">${value}</span>
                          ${extraBadge}
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
                      <span class="fw-bold">${position}</span>
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

  // 为背包中的道具绑定点击事件
  for (const item of player.pack) {
    const tooltipContent = generateItemTooltipContent(item);
    const btn = document.getElementById(`use-btn${item.uuid}`);
    if (!btn) continue;

    tippy(btn, {
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
  }

  // 为装备栏中的装备绑定点击事件
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
}
