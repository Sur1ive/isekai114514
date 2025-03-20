import { equipmentConfigs, EquipmentType } from "./equipmentConfigs";
import { Equipment } from "./Equipment";
import { Rarity } from "../types";
import { prefixConfigs, PrefixType } from "./prefixConfigs";
import { EquipmentPosition } from "./types";
import { actionConfigs } from "../actions/actionConfigs";

// 生成随机前缀
export function generateRandomPrefix(rarity: Rarity, position: EquipmentPosition) {
  const prefixKeys = Object.keys(prefixConfigs).filter(
    (key) => prefixConfigs[key as PrefixType].rarity === rarity && (prefixConfigs[key as PrefixType].position === position || prefixConfigs[key as PrefixType].position === "AnyPosition"),
  );
  const randomIndex = Math.floor(Math.random() * prefixKeys.length);
  const randomPrefixKey = prefixKeys[randomIndex];

  return prefixConfigs[randomPrefixKey as PrefixType] || prefixConfigs[PrefixType.None];
}

// 根据稀有度随机抽取装备类型
export function generateRandomEquipment(rarity: Rarity, level: number): Equipment {
  // 筛选出稀有度为rarity的装备类型
  const equipmentKeys = Object.keys(equipmentConfigs).filter(
    (key) => equipmentConfigs[key as EquipmentType].rarity === rarity,
  );
  const randomIndex = Math.floor(Math.random() * equipmentKeys.length);
  const randomEquipmentKey = equipmentKeys[randomIndex];
  return new Equipment(randomEquipmentKey as EquipmentType, level);
}

/**
 * 获取装备 tooltip 的 HTML 内容
 * 显示基本信息、属性、额外行动和行动系数
 */
export function generateEquipmentTooltipContent(equipment: Equipment): string {
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
