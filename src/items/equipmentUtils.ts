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
    (key) => equipmentConfigs[key as EquipmentType].rarity === rarity && !equipmentConfigs[key as EquipmentType].canNotObtainFromChest,
  );
  const randomIndex = Math.floor(Math.random() * equipmentKeys.length);
  const randomEquipmentKey = equipmentKeys[randomIndex];
  return new Equipment(randomEquipmentKey as EquipmentType, level);
}

const attrNameMap: Record<string, string> = {
  str: "力量", dex: "敏捷", con: "体质", int: "智力",
  siz: "体型", app: "魅力", armor: "护甲", piercing: "穿刺",
};

const posIconMap: Record<string, string> = {
  hand: "🗡️", body: "🛡️", foot: "👢", accessory: "💎",
};

const posLabelMap: Record<string, string> = {
  hand: "武器", body: "防具", foot: "鞋子", accessory: "饰品",
};

const hitCatNameMap: Record<string, string> = {
  Attack: "攻击", Defend: "防御", Dodge: "闪避",
  Capture: "捕捉", Special: "特殊", None: "无",
};

const rarityNameMap: Record<number, string> = {
  [Rarity.Common]: "普通", [Rarity.Rare]: "稀有", [Rarity.Masterpiece]: "杰作",
  [Rarity.Epic]: "史诗", [Rarity.Mythical]: "神话", [Rarity.Unique]: "独特",
};

const pfxMark = (val: number | undefined) =>
  val ? `<span class="eq-pfx-mark">${val > 0 ? "▲" : "▼"}</span>` : "";

export function generateEquipmentTooltipContent(equipment: Equipment): string {
  const rarityClass = Rarity[equipment.rarity];
  const rarityLabel = rarityNameMap[equipment.rarity] ?? "";
  const prefix = equipment.prefix;
  const hasPrefix = !!prefix.name;
  const prefixRarityClass = Rarity[prefix.rarity];

  const isUnique = equipment.rarity === Rarity.Unique;
  const prefixHtml = hasPrefix
    ? `<span class="text-${prefixRarityClass}">${prefix.name}</span>`
    : "";

  const uniqueTag = isUnique ? ` <span class="eq-tag eq-tag-unique-grow">随角色升级</span>` : "";

  const statsEntries = Object.entries(equipment.ability).filter(([, v]) => v);
  const statsHtml = statsEntries.length > 0
    ? `<div class="eq-section">
        <div class="eq-stats-grid">
          ${statsEntries.map(([k, v]) => {
            const sign = v > 0 ? "+" : "";
            const cls = v > 0 ? "eq-stat-pos" : "eq-stat-neg";
            const mark = pfxMark(prefix.ability?.[k as keyof typeof prefix.ability]);
            return `<div class="eq-stat"><span class="eq-stat-label">${attrNameMap[k] || k}</span><span><span class="${cls}">${sign}${v}</span>${mark}</span></div>`;
          }).join("")}
        </div>
      </div>`
    : "";

  const baseActionCount = equipment.extraActions.length - prefix.extraActions.length;
  const allActions = equipment.extraActions;

  const actionsHtml = allActions.length > 0
    ? `<div class="eq-section">
        <div class="eq-section-title">额外行动</div>
        <div class="eq-action-list">
          ${allActions.map((a, i) => {
            const isPrefix = i >= baseActionCount;
            const cls = isPrefix ? "eq-action-item eq-action-prefix" : "eq-action-item";
            return `<span class="${cls}"><span class="eq-action-name">${actionConfigs[a.actionType].name}</span><span class="eq-action-weight">${a.weight.toFixed(2)}</span></span>`;
          }).join("")}
        </div>
      </div>`
    : "";

  const coeffEntries = Object.entries(equipment.actionCoeff)
    .filter(([, c]) => c.plus !== 0 || c.multiply !== 1);
  const coeffHtml = coeffEntries.length > 0
    ? `<div class="eq-section">
        <div class="eq-section-title">行动系数</div>
        <div class="eq-stats-grid">
          ${coeffEntries.map(([cat, c]) => {
            const pc = prefix.actionCoeff?.[cat as keyof typeof prefix.actionCoeff];
            const parts: string[] = [];
            if (c.plus !== 0) parts.push(`<span class="${c.plus > 0 ? "eq-stat-pos" : "eq-stat-neg"}">${c.plus > 0 ? "+" : ""}${c.plus}</span>`);
            if (c.multiply !== 1) parts.push(`<span class="eq-stat-pos">×${c.multiply}</span>`);
            const mark = pc ? pfxMark(pc.plus !== 0 ? pc.plus : (pc.multiply !== 1 ? 1 : undefined)) : "";
            return `<div class="eq-stat"><span class="eq-stat-label">${hitCatNameMap[cat] || cat}</span><span>${parts.join(" ")}${mark}</span></div>`;
          }).join("")}
        </div>
      </div>`
    : "";

  return `
    <div class="eq-card eq-card-${rarityClass}">
      <div class="eq-header">
        <div class="eq-name text-${rarityClass}">lv${equipment.level} ${prefixHtml}${equipment.name}</div>
        <div class="eq-pos">${posIconMap[equipment.position] || ""}<span class="eq-tag eq-tag-${rarityClass}">${rarityLabel}</span>${uniqueTag} ${posLabelMap[equipment.position] || equipment.position}</div>
      </div>
      <div class="eq-desc">"${equipment.description}"</div>
      ${statsHtml}${actionsHtml}${coeffHtml}
    </div>
  `;
}
