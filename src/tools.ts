import { Rarity } from "./types";
import { ItemCategory } from "./items/types";
import type { Item } from "./items/Item";
import { HitCategory } from "./actions/types";
import { Hit } from "./actions/Action";
import { Consumable } from "./items/Consumable";
import { Equipment } from "./items/Equipment";
import { actionConfigs } from "./actions/actionConfigs";

export function getAppElement(): HTMLElement {
  const el = document.getElementById("app");
  if (!el) {
    throw new Error("无法找到挂载点 #app");
  }
  return el;
}

export function getHitIcon(hit: Hit): string {
  switch (hit.category) {
    case HitCategory.Attack:
      return "🗡️";
    case HitCategory.Defend:
      return "🛡️";
    case HitCategory.Dodge:
      return "💫";
    case HitCategory.Capture:
      return "🕸️";
    case HitCategory.Special:
      return "💥";
    // case HitCategory.DexAction:
    //   return "💫";
    // case HitCategory.StrAction:
    //   return "🦾";
    // case HitCategory.IntAction:
    //   return "📚";
    // case HitCategory.ConAction:
    //   return "❤️‍🔥";
    // case HitCategory.SizAction:
    //   return "🐋";
    // case HitCategory.AppAction:
    //   return "✨";
    case HitCategory.None:
      return "❔";
    default:
      return "";
  }
}

export function getItemIcon(item: Item): string {
  switch (item.category) {
    case ItemCategory.Equipment:
      return "🗡️";
    case ItemCategory.Consumable:
      return "🗝️";
    default:
      return "";
  }
}

/**
 * 获取装备 tooltip 的 HTML 内容
 * 显示基本信息、属性、额外行动和行动系数
 */
function generateEquipmentTooltipContent(equipment: Equipment): string {
  // 基本信息部分：名称、稀有度、描述、装备位置
  const baseInfo = `
    <div class="tooltip-base tooltip-header">
      <h5 class="text-${Rarity[equipment.rarity]}" style="font-weight: bold;">lv${equipment.level} ${equipment.name}</h5>
      <p>${equipment.description}</p>
      <p><strong>位置:</strong> ${equipment.position}</p>
      <br>
    </div>
  `;

  // 属性部分（例如力量、体质等）
  let abilitiesHtml = "";
  if (equipment.ability && Object.keys(equipment.ability).length > 0) {
    abilitiesHtml = `
    <div class="tooltip-abilities tooltip-extra">
      <p><strong>属性: </strong>
        ${Object.entries(equipment.ability)
          .filter(([_stat, value]) => value)
          .map(([stat, value]) => `${stat}: ${value}`)
          .join(", ")}
      </p>
    </div>
  `;
  }

  // 额外行动部分，根据 extraActions 数组生成
  let extraActionsHtml = "";
  if (equipment.extraActions && equipment.extraActions.length > 0) {
    extraActionsHtml = `
      <div class="tooltip-extra-actions tooltip-extra">
        <p><strong>额外行动: </strong>
          ${equipment.extraActions
            .map(
              (action) =>
                `${actionConfigs[action.actionType].name} (权重: ${action.weight.toFixed(2)})`,
            )
            .join(", ")}
      </div>
    `;
  }

  // 行动系数部分，遍历 actionCoeff 对象（每个分类有 plus 与 multiply 值）
  let actionCoeffHtml = "";
  if (equipment.actionCoeff && Object.keys(equipment.actionCoeff).length > 0) {
    actionCoeffHtml = `
      <div class="tooltip-action-coeff tooltip-extra">
        <p><strong>行动系数: </strong>
          ${Object.entries(equipment.actionCoeff)
            .map(
              ([category, coeff]) =>
                `${category}: ${coeff.plus < 0 ? "" : "+"}${coeff.plus} ${coeff.multiply === 1 ? "" : "x" + coeff.multiply}`,
            )
            .join(", ")}
      </div>
    `;
  }

  return baseInfo + abilitiesHtml + extraActionsHtml + actionCoeffHtml;
}

/**
 * 根据不同的物品类型生成 tooltip 内容
 */
export function generateItemTooltipContent(item: Item): string {
  // Consumable 只显示基础信息：名称、稀有度、描述
  if (item instanceof Consumable) {
    return `
      <div class="tooltip-base tooltip-header">
        <h5 class="text-${Rarity[item.rarity]}">${item.level ? `lv${item.level}` : ""} ${item.name}</h5>
        <p>${item.description}</p>
      </div>
    `;
  }

  // Equipment 则显示更多内容
  if (item instanceof Equipment) {
    return generateEquipmentTooltipContent(item);
  }

  // 其他类型则简单显示名称和描述
  return `
    <div class="tooltip-base">
      <h5>${item.name}</h5>
      <p>${item.description}</p>
    </div>
  `;
}
