import { Player } from "../creatures/Player";
import { saveGame } from "../save";
import { Consumable } from "../items/Consumable";
import { Equipment } from "../items/Equipment";
import * as bootstrap from "bootstrap";
import { renderMainMenu } from "./mainMenu";
import { Rarity } from "../types";
import { Ability } from "../creatures/types";
import { actionConfigs } from "../actions/actionConfigs";
import { generateItemTooltipContent, getItemIcon } from "../items/itemUtils";
import { getAppElement } from "./utils";
import { generateActionPopoverContent } from "../actions/actionUtils";

// 渲染状态界面
export function renderStatusPage(player: Player): void {
  const appElement = getAppElement();

  // 在渲染前清理所有 Tooltip 实例
  function disposeTooltips(): void {
    const tooltipElements = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    tooltipElements.forEach((el) => {
      const tooltipInstance = bootstrap.Tooltip.getInstance(el);
      if (tooltipInstance) {
        tooltipInstance.dispose();
      }
    });
  }
  disposeTooltips();

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
              <ul class="list-group">
                ${player.getActions()
                  .sort((a, b) => actionConfigs[b.actionType].rarity - actionConfigs[a.actionType].rarity)
                  .map(action => `
                    <li class="list-group-item" tabindex="0"
                        data-bs-toggle="popover"
                        data-bs-trigger="focus"
                        data-bs-html="true"
                        data-bs-title="${actionConfigs[action.actionType].name}"
                        data-bs-content="
                          <div>
                            ${generateActionPopoverContent(player, actionConfigs[action.actionType])}
                          </div>
                        ">
                      <div class="d-flex justify-content-between align-items-center">
                        <span>${actionConfigs[action.actionType].name}</span>
                        <span class="badge bg-${Rarity[actionConfigs[action.actionType].rarity]}">${action.weight.toFixed(2)}</span>
                      </div>
                    </li>
                  `).join("")}
              </ul>
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
                          ? `<span class="badge bg-${Rarity[equipment.rarity]}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" title="${generateItemTooltipContent(equipment).replace(/"/g, "&quot;")}">${equipment.name}</span>`
                          : '<span class="badge bg-secondary">空</span>'
                      }
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- 背包区域 -->
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header bg-secondary text-white">
              <h4 class="card-title">${player.name} 的背包</h4>
            </div>
            <div class="card-body">
              <div id="pack" class="d-flex flex-wrap gap-2">
                ${
                  player.pack.length > 0
                    ? player.pack
                        .sort((a, b) => b.rarity - a.rarity)
                        .map((item) => {
                          const btnClass = `btn-${Rarity[item.rarity]}`;
                          // 如果 item 属于 Consumable 或 Equipment，则调用 generateItemTooltipContent，否则使用 item.description
                          const tooltipContent =
                            item instanceof Consumable ||
                            item instanceof Equipment
                              ? generateItemTooltipContent(item)
                              : item.description;
                          return `<button id="use-btn${item.uuid}" class="btn ${btnClass}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" title="${tooltipContent.replace(/"/g, "&quot;")}">${getItemIcon(item)}${item.name}</button>`;
                        })
                        .join("")
                    : '<p class="text-muted">背包为空</p>'
                }
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
                      `,
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
    if (item instanceof Consumable) {
      document
        .getElementById(`use-btn${item.uuid}`)
        ?.addEventListener("click", () => {
          item.useItem(player);
          player.addLog(`${player.name} 使用了 ${item.name}`);
          saveGame(player);
          renderStatusPage(player);
        });
    }
    if (item instanceof Equipment) {
      document
        .getElementById(`use-btn${item.uuid}`)
        ?.addEventListener("click", () => {
          player.wearEquipment(item);
          saveGame(player);
          renderStatusPage(player);
        });
    }
  }

  // 为装备栏中的装备绑定点击事件（点击时卸下装备）
  for (const [position, equipment] of Object.entries(player.equipments)) {
    if (equipment) {
      document
        .getElementById(`equipment-slot-${position}`)
        ?.addEventListener("click", () => {
          player.removeEquipment(equipment.position);
          saveGame(player);
          renderStatusPage(player);
        });
    }
  }

  // 初始化 Bootstrap Tooltip
  const tooltipTriggerList = Array.from(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl, { placement: "top", html: true });
  });
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
}
